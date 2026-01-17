import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto, CreateAdminDto } from './admin.dto';
import { Anonymous } from '../../decorators/anonymous.decorator';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin')
@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  @Anonymous()
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @Post('login')
  @Anonymous()
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }
}
