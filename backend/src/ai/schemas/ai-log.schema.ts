import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AILogDocument = AILog & Document;

@Schema({ timestamps: true })
export class AILog {
  @Prop({ required: true })
  modelVersion: string;

  @Prop({ type: Object })
  predictionData: any;

  @Prop({ default: 0 })
  accuracy: number;

  @Prop()
  processingTime: number;

  @Prop()
  gestureRecognized: string;

  @Prop()
  confidence: number;
}

export const AILogSchema = SchemaFactory.createForClass(AILog);
