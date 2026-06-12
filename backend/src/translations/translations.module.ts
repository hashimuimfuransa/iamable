import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';
import { Translation, TranslationSchema } from './schemas/translation.schema';
import { TranslationHistory, TranslationHistorySchema } from './schemas/translation-history.schema';
import { SavedItem, SavedItemSchema } from './schemas/saved-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Translation.name, schema: TranslationSchema },
      { name: TranslationHistory.name, schema: TranslationHistorySchema },
      { name: SavedItem.name, schema: SavedItemSchema },
    ]),
  ],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
