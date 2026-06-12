import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemMetricDocument = SystemMetric & Document;

@Schema({ timestamps: true })
export class SystemMetric {
  @Prop({ required: true })
  metricType: string;

  @Prop({ type: Object })
  metricData: any;

  @Prop()
  cpuUsage: number;

  @Prop()
  memoryUsage: number;

  @Prop()
  diskUsage: number;

  @Prop()
  activeUsers: number;

  @Prop()
  totalRequests: number;

  @Prop()
  averageResponseTime: number;

  @Prop()
  errorRate: number;

  @Prop()
  uptime: number;
}

export const SystemMetricSchema = SchemaFactory.createForClass(SystemMetric);
