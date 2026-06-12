import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export class CreateReportDto {
  @IsEnum(['bug', 'feature', 'translation-error', 'other'])
  reportType: string;

  @IsString()
  message: string;

  @IsArray()
  @IsOptional()
  screenshots?: string[];
}
