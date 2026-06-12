import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TranslationHistoryDocument = TranslationHistory & Document;

@Schema({ timestamps: true })
export class TranslationHistory {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Translation', required: true })
  translationId: Types.ObjectId;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const TranslationHistorySchema = SchemaFactory.createForClass(TranslationHistory);
