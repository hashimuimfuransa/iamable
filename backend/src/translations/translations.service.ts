import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Translation, TranslationDocument } from './schemas/translation.schema';
import { TranslationHistory, TranslationHistoryDocument } from './schemas/translation-history.schema';
import { SavedItem, SavedItemDocument } from './schemas/saved-item.schema';
import { CreateTranslationDto } from './dto/create-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectModel(Translation.name) private translationModel: Model<TranslationDocument>,
    @InjectModel(TranslationHistory.name) private historyModel: Model<TranslationHistoryDocument>,
    @InjectModel(SavedItem.name) private savedItemModel: Model<SavedItemDocument>,
  ) {}

  async create(userId: string, createTranslationDto: CreateTranslationDto) {
    const translation = await this.translationModel.create({
      userId: new Types.ObjectId(userId),
      ...createTranslationDto,
    });

    await this.historyModel.create({
      userId: new Types.ObjectId(userId),
      translationId: translation._id,
    });

    return translation;
  }

  async findAll(userId: string) {
    return this.translationModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async findOne(id: string, userId: string) {
    const translation = await this.translationModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    if (!translation) {
      throw new NotFoundException('Translation not found');
    }
    return translation;
  }

  async getHistory(userId: string, limit: number = 20) {
    return this.historyModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('translationId')
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async getSavedItems(userId: string) {
    return this.savedItemModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('translationId')
      .sort({ savedAt: -1 });
  }

  async saveItem(userId: string, translationId: string, notes?: string) {
    const existing = await this.savedItemModel.findOne({
      userId: new Types.ObjectId(userId),
      translationId: new Types.ObjectId(translationId),
    });

    if (existing) {
      return existing;
    }

    const savedItem = await this.savedItemModel.create({
      userId: new Types.ObjectId(userId),
      translationId: new Types.ObjectId(translationId),
      notes,
    });

    await this.translationModel.findByIdAndUpdate(translationId, { isSaved: true });

    return savedItem;
  }

  async unsaveItem(userId: string, translationId: string) {
    await this.savedItemModel.deleteOne({
      userId: new Types.ObjectId(userId),
      translationId: new Types.ObjectId(translationId),
    });

    await this.translationModel.findByIdAndUpdate(translationId, { isSaved: false });

    return { message: 'Item removed from saved' };
  }

  async remove(id: string, userId: string) {
    const translation = await this.translationModel.findOneAndDelete({
      _id: id,
      userId: new Types.ObjectId(userId),
    });

    if (!translation) {
      throw new NotFoundException('Translation not found');
    }

    await this.historyModel.deleteMany({ translationId: id });
    await this.savedItemModel.deleteMany({ translationId: id });

    return { message: 'Translation deleted' };
  }

  async getStats(userId: string) {
    const totalTranslations = await this.translationModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });
    const savedTranslations = await this.savedItemModel.countDocuments({
      userId: new Types.ObjectId(userId),
    });
    const avgConfidence = await this.translationModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, avgConfidence: { $avg: '$confidenceScore' } } },
    ]);

    return {
      totalTranslations,
      savedTranslations,
      avgConfidence: avgConfidence[0]?.avgConfidence || 0,
    };
  }
}
