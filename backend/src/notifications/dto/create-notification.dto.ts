import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(['info', 'success', 'warning', 'error'])
  type: 'info' | 'success' | 'warning' | 'error';

  @IsOptional()
  @IsString()
  link?: string;
}
