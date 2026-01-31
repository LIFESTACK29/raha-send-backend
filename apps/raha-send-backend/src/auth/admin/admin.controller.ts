import { Controller, Post, Get, Body, UseGuards, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AdminLoginDto, CreateAdminDto, AdminResponseDto } from './admin.dto';
import { Anonymous } from '../../decorators/anonymous.decorator';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('Admin')
@Controller('auth/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('register')
  @Anonymous()
  @ApiOperation({ summary: 'Register a new admin' })
  @ApiResponse({
    status: 201,
    description: 'Admin registered successfully',
    type: AdminResponseDto,
  })
  async register(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @Post('login')
  @Anonymous()
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    type: AdminResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all admins (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all admins',
  })
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get admin by ID (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Admin details',
  })
  async getAdminById(@Param('id') id: string) {
    return this.adminService.getAdminById(id);
  }
}
