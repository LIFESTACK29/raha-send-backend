import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Param,
  Request,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { RiderService } from './rider.service';
import { RiderLoginDto, CreateRiderDto, RiderResponseDto, RiderSelfUpdateDto, AdminUpdateRiderDto } from './rider.dto';
import { Anonymous } from '../../decorators/anonymous.decorator';
import { AdminGuard } from '../guards/admin.guard';
import { RiderGuard } from '../guards/rider.guard';
import { ShipmentService } from '@app/shipment';
import { ShipmentStatus } from '@app/common';

@ApiTags('Rider')
@Controller('auth/rider')
export class RiderController {
  constructor(
    private riderService: RiderService,
    private shipmentService: ShipmentService,
  ) { }

  @Post('login')
  @Anonymous()
  @ApiOperation({
    summary: 'Rider login',
    description: 'Authenticates a rider using email and password. Returns a JWT token for subsequent requests. Access: Public (no authentication required).',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    type: RiderResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() riderLoginDto: RiderLoginDto) {
    return this.riderService.login(riderLoginDto);
  }

  @Post('register')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'vehicle[driversLicenseImage]', maxCount: 1 },
      { name: 'vehicle[carImages]', maxCount: 5 },
    ]),
  )
  @ApiOperation({
    summary: 'Create a new rider (Admin only)',
    description: 'Registers a new rider account with vehicle information. Access: Admin only. This endpoint generates a default password for the rider based on their name and phone number.',
  })
  @ApiResponse({
    status: 201,
    description: 'Rider created successfully',
    type: RiderResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async register(
    @Body() createRiderDto: CreateRiderDto,
    @UploadedFiles()
    files: {
      profileImage?: Express.Multer.File[];
      'vehicle[driversLicenseImage]'?: Express.Multer.File[];
      'vehicle[carImages]'?: Express.Multer.File[];
    },
    @Request() req,
  ) {
    // Map nested file keys to expected service structure
    const serviceFiles = {
      profileImage: files.profileImage,
      driversLicenseImage: files['vehicle[driversLicenseImage]'],
      carImages: files['vehicle[carImages]'],
    };
    if (typeof createRiderDto.vehicle === 'string') {
      try {
        createRiderDto.vehicle = JSON.parse(createRiderDto.vehicle);
      } catch (e) {
        // ignore, might be validation error caught later or actual string
      }
    }

    return this.riderService.register(
      createRiderDto,
      serviceFiles,
      req.user.id,
    );
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all riders (Admin only)',
    description: 'Retrieves a list of all registered riders with their vehicle information. Access: Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all riders',
  })
  async getAllRiders() {
    return this.riderService.getAllRiders();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get rider by ID (Admin only)',
    description: 'Retrieves detailed information about a specific rider including vehicle details. Access: Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rider details',
  })
  async getRiderById(@Param('id') id: string) {
    return this.riderService.getRiderById(id);
  }

  @Get('profile/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get own profile (Rider only)',
    description: 'Retrieves the authenticated rider\'s own profile information including vehicle details. Access: Rider only (authenticated).',
  })
  @ApiResponse({
    status: 200,
    description: 'Your rider profile',
    type: RiderResponseDto,
  })
  async getOwnProfile(@Request() req) {
    return this.riderService.getRiderById(req.user.id);
  }

  @Patch('profile/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: 'Update own profile (Rider only)',
    description: 'Allows the authenticated rider to update their own email, phone number, and profile photo. Access: Rider only. Other fields cannot be modified by the rider.',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: RiderResponseDto,
  })
  async updateOwnProfile(
    @Request() req,
    @Body() updateDto: RiderSelfUpdateDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    return this.riderService.riderSelfUpdate(req.user.id, updateDto, profileImage);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profileImage'))
  @ApiOperation({
    summary: 'Update rider details (Admin only)',
    description: 'Allows admin to update any rider\'s profile including name, date of birth, status, and ability to activate/deactivate accounts. Access: Admin only.',
  })
  @ApiResponse({
    status: 200,
    description: 'Rider updated successfully',
    type: RiderResponseDto,
  })
  async updateRider(
    @Param('id') id: string,
    @Body() updateDto: AdminUpdateRiderDto,
    @UploadedFile() profileImage?: Express.Multer.File,
  ) {
    return this.riderService.updateRider(id, updateDto, profileImage);
  }

  @Get('jobs/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get assigned shipments (Rider only)',
    description: 'Retrieves all shipments assigned to the authenticated rider. Access: Rider only.',
  })
  async getMyJobs(@Request() req) {
    // Rider ID is available in req.user.id
    return this.shipmentService.findByRiderId(req.user.id);
  }

  @Post('jobs/:id/status')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update shipment status (Rider only)',
    description: 'Updates the status of an assigned shipment. Only the rider assigned to the shipment can update its status. Access: Rider only.',
  })
  async updateStatus(
    @Request() req,
    @Param('id') shipmentId: string,
    @Body('status') status: ShipmentStatus
  ) {
    // Pass riderId to verify assignment
    return this.shipmentService.updateStatus(shipmentId, status, req.user.id);
  }

  @Post('push-token')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update push token (Rider only)',
    description: 'Updates the push notification token for the authenticated rider.',
  })
  async updatePushToken(
    @Request() req,
    @Body('token') token: string,
    @Body('platform') platform: 'ios' | 'android',
  ) {
    return this.riderService.updatePushToken(req.user.id, token, platform);
  }
}
