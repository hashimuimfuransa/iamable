import { Controller, Post, Get, Body, UseGuards, Query, Param, Put, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTrainingDto } from './dto/create-training.dto';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('predict')
  async predict(@Body('gestureData') gestureData: any) {
    return this.aiService.processGesture(gestureData);
  }

  @Get('logs')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getLogs(@Query('limit') limit?: number) {
    return this.aiService.getLogs(limit);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStats() {
    return this.aiService.getStats();
  }

  @Post('training')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async createTraining(@Body() createTrainingDto: CreateTrainingDto, @Req() req) {
    return this.aiService.createTraining(createTrainingDto, req.user.id);
  }

  @Get('training')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTrainingHistory() {
    return this.aiService.getTrainingHistory();
  }

  @Get('training/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getTraining(@Param('id') id: string) {
    return this.aiService.getTraining(id);
  }

  @Put('training/:id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateTrainingStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('accuracy') accuracy?: number,
    @Body('loss') loss?: number,
    @Body('errorMessage') errorMessage?: string,
  ) {
    return this.aiService.updateTrainingStatus(id, status, accuracy, loss, errorMessage);
  }
}
