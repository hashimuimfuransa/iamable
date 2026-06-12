import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: ['bug', 'feature', 'translation-error', 'other'] })
  reportType: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'pending', enum: ['pending', 'in-progress', 'resolved', 'closed'] })
  status: string;

  @Prop()
  adminResponse: string;

  @Prop()
  screenshots: string[];
}

export const ReportSchema = SchemaFactory.createForClass(Report);
