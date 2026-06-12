import { IsString, IsOptional, IsNumber, IsEnum, IsObject } from 'class-validator';

export class CreateTrainingDto {
  @IsString()
  trainingName: string;

  @IsString()
  modelVersion: string;

  @IsOptional()
  @IsObject()
  trainingData?: any;

  @IsOptional()
  @IsNumber()
  datasetSize?: number;

  @IsOptional()
  @IsNumber()
  epochs?: number;

  @IsOptional()
  @IsNumber()
  batchSize?: number;

  @IsOptional()
  @IsNumber()
  learningRate?: number;
}
