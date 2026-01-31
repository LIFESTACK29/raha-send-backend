import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RiderService } from './rider.service';
import { RiderLoginDto, CreateRiderDto, RiderResponseDto } from './rider.dto';
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
  @ApiOperation({ summary: 'Rider login' })
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
  @ApiOperation({ summary: 'Create a new rider (Admin only)' })
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
  @ApiOperation({ summary: 'Get all riders (Admin only)' })
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
  @ApiOperation({ summary: 'Get rider by ID (Admin only)' })
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
  @ApiOperation({ summary: 'Get own profile (Rider only)' })
  @ApiResponse({
    status: 200,
    description: 'Your rider profile',
    type: RiderResponseDto,
  })
  async getOwnProfile(@Request() req) {
    return this.riderService.getRiderById(req.user.id);
  }

  @Get('jobs/me')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get assigned shipments (Rider only)' })
  async getMyJobs(@Request() req) {
    // Rider ID is available in req.user.id
    return this.shipmentService.findByRiderId(req.user.id);
  }

  @Post('jobs/:id/status')
  @UseGuards(RiderGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update shipment status (Rider only)' })
  async updateStatus(
    @Request() req,
    @Param('id') shipmentId: string,
    @Body('status') status: ShipmentStatus
  ) {
    // Pass riderId to verify assignment
    return this.shipmentService.updateStatus(shipmentId, status, req.user.id);
  }
}
