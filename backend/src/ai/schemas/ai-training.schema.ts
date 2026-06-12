import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AITrainingDocument = AITraining & Document;

@Schema({ timestamps: true })
export class AITraining {
  @Prop({ required: true })
  trainingName: string;

  @Prop({ required: true })
  modelVersion: string;

  @Prop({ required: true, enum: ['pending', 'training', 'completed', 'failed'], default: 'pending' })
  status: string;

  @Prop({ type: Object })
  trainingData: any;

  @Prop()
  datasetSize: number;

  @Prop()
  epochs: number;

  @Prop()
  batchSize: number;

  @Prop()
  learningRate: number;

  @Prop()
  accuracy: number;

  @Prop()
  loss: number;

  @Prop()
  trainingTime: number;

  @Prop()
  errorMessage: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  trainedBy: Types.ObjectId;

  @Prop({ type: Object })
  modelMetrics: any;
}

export const AITrainingSchema = SchemaFactory.createForClass(AITraining);
