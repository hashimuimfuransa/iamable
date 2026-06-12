import { Controller, Get, Post, Put, Body, Param, UseGuards, Request, Query, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateReportDto } from './dto/create-report.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('reports')
  async createReport(@Request() req, @Body() createReportDto: CreateReportDto) {
    return this.adminService.createReport(req.user.id, createReportDto);
  }

  @Get('reports')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getReports() {
    return this.adminService.findAll();
  }

  @Get('reports/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getReport(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Put('reports/:id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateReportStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('adminResponse') adminResponse?: string,
  ) {
    return this.adminService.updateStatus(id, status, adminResponse);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('users')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers(page, limit, search);
  }

  @Get('users/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id/role')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
