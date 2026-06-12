import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateTranslationDto {
  @IsEnum(['sign-to-text', 'text-to-sign', 'voice-to-sign'])
  inputType: string;

  @IsString()
  inputContent: string;

  @IsString()
  translatedText: string;

  @IsNumber()
  @IsOptional()
  confidenceScore?: number;

  @IsOptional()
  gestureData?: any;
}
