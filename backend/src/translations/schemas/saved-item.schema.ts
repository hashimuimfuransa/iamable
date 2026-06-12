import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SavedItemDocument = SavedItem & Document;

@Schema({ timestamps: true })
export class SavedItem {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Translation', required: true })
  translationId: Types.ObjectId;

  @Prop()
  notes: string;

  @Prop({ default: Date.now })
  savedAt: Date;
}

export const SavedItemSchema = SchemaFactory.createForClass(SavedItem);
