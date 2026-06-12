import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('admin/system')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class SystemMetricsController {
  constructor(private adminService: AdminService) {}

  @Post('metrics')
  async logMetric(@Body() metricData: any) {
    return this.adminService.logSystemMetric(metricData);
  }

  @Get('metrics')
  async getMetrics(@Query('limit') limit?: number, @Query('type') type?: string) {
    return this.adminService.getSystemMetrics(limit, type);
  }

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
