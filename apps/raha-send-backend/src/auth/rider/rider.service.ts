import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Rider, IRider } from '@app/common';
import { Vehicle, IVehicle } from './vehicle.schema';
import { RiderLoginDto, CreateRiderDto, RiderResponseDto, RiderSelfUpdateDto, AdminUpdateRiderDto } from './rider.dto';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class RiderService {
  constructor(
    @InjectModel(Rider.name) private riderModel: Model<IRider>,
    @InjectModel(Vehicle.name) private vehicleModel: Model<IVehicle>,
    private jwtService: JwtService,
    private storageService: StorageService,
  ) { }

  async register(
    createRiderDto: CreateRiderDto,
    files: {
      profileImage?: Express.Multer.File[];
      driversLicenseImage?: Express.Multer.File[];
      carImages?: Express.Multer.File[];
    },
    createdBy: string,
  ): Promise<RiderResponseDto> {
    const {
      email,
      firstName,
      lastName,
      phone,
      sex,
      dateOfBirth,
      vehicle: vehicleData,
    } = createRiderDto;

    const existingEmail = await this.riderModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Rider with this email already exists');
    }

    const existingPhone = await this.riderModel.findOne({ phone });
    if (existingPhone) {
      throw new BadRequestException('Rider with this phone number already exists');
    }

    if (!firstName || !lastName || !phone || phone.length < 4) {
      throw new BadRequestException(
        'Invalid name or phone number for password generation',
      );
    }
    const password =
      `${firstName.charAt(0)}${lastName.charAt(0)}${phone.slice(-4)}`.toUpperCase();

    let profileImageUrl = '';
    if (files.profileImage && files.profileImage[0]) {
      profileImageUrl = await this.storageService.upload(
        files.profileImage[0],
        'riders/profiles',
      );
    }

    let driversLicenseUrl = '';
    if (files.driversLicenseImage && files.driversLicenseImage[0]) {
      driversLicenseUrl = await this.storageService.upload(
        files.driversLicenseImage[0],
        'riders/licenses',
      );
    }

    const carImageUrls: string[] = [];
    if (files.carImages && files.carImages.length > 0) {
      for (const file of files.carImages) {
        const url = await this.storageService.upload(file, 'riders/cars');
        carImageUrls.push(url);
      }
    }

    const rider = new this.riderModel({
      email,
      password,
      firstName,
      lastName,
      sex,
      dateOfBirth,
      phone,
      profileImage: profileImageUrl,
      role: 'rider',
      createdBy,
    });

    const vehicle = new this.vehicleModel({
      ...vehicleData,
      driversLicenseImage: driversLicenseUrl,
      carImages: carImageUrls,
      rider: rider._id,
    });

    const savedVehicle = await vehicle.save();

    rider.vehicle = savedVehicle._id as any;
    await rider.save();

    return {
      message: 'Rider registered successfully',
      data: {
        id: rider._id.toString(),
        email: rider.email,
        firstName: rider.firstName,
        lastName: rider.lastName,
        phone: rider.phone,
        role: rider.role,
        isActive: rider.isActive,
      },
    };
  }

  async login(riderLoginDto: RiderLoginDto): Promise<RiderResponseDto> {
    const { email, password } = riderLoginDto;

    const rider = await this.riderModel.findOne({ email });
    if (!rider) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!rider.isActive) {
      throw new UnauthorizedException('Rider account is inactive');
    }

    const isPasswordValid = await rider.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign(
      {
        id: rider._id,
        email: rider.email,
        role: rider.role,
      },
      { expiresIn: '24h' },
    );

    return {
      message: 'Rider login successful',
      data: {
        id: rider._id.toString(),
        email: rider.email,
        firstName: rider.firstName,
        lastName: rider.lastName,
        phone: rider.phone,
        role: rider.role,
        isActive: rider.isActive,
        accessToken: token,
      },
    };
  }

  async validateRiderById(id: string): Promise<IRider> {
    const rider = await this.riderModel.findById(id);
    if (!rider) {
      throw new UnauthorizedException('Rider not found');
    }
    return rider;
  }

  async getAllRiders() {
    const riders = await this.riderModel.find().select('-password').populate('vehicle');
    return {
      message: 'All riders retrieved successfully',
      data: riders,
    };
  }

  async getRiderById(id: string) {
    const rider = await this.riderModel
      .findById(id)
      .select('-password')
      .populate('vehicle');
    return {
      message: 'Rider retrieved successfully',
      data: rider,
    };
  }

  async updateRider(id: string, updates: AdminUpdateRiderDto, profileImage?: Express.Multer.File) {
    // Check for unique email if updating
    if (updates.email) {
      const existingEmail = await this.riderModel.findOne({ email: updates.email, _id: { $ne: id } });
      if (existingEmail) {
        throw new BadRequestException('A rider with this email already exists');
      }
    }

    // Check for unique phone if updating
    if (updates.phone) {
      const existingPhone = await this.riderModel.findOne({ phone: updates.phone, _id: { $ne: id } });
      if (existingPhone) {
        throw new BadRequestException('A rider with this phone number already exists');
      }
    }

    // Handle profile image upload if provided
    let profileImageUrl: string | undefined;
    if (profileImage) {
      profileImageUrl = await this.storageService.upload(profileImage, 'riders/profiles');
    }

    const updateData = {
      ...updates,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    };

    const rider = await this.riderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .select('-password');
    return {
      message: 'Rider updated successfully',
      data: rider,
    };
  }

  // Rider self-update: limited to email, phone, and profile image
  async riderSelfUpdate(
    riderId: string,
    updates: RiderSelfUpdateDto,
    profileImage?: Express.Multer.File,
  ) {
    // Check for unique email if updating
    if (updates.email) {
      const existingEmail = await this.riderModel.findOne({ email: updates.email, _id: { $ne: riderId } });
      if (existingEmail) {
        throw new BadRequestException('A rider with this email already exists');
      }
    }

    // Check for unique phone if updating
    if (updates.phone) {
      const existingPhone = await this.riderModel.findOne({ phone: updates.phone, _id: { $ne: riderId } });
      if (existingPhone) {
        throw new BadRequestException('A rider with this phone number already exists');
      }
    }

    // Handle profile image upload if provided
    let profileImageUrl: string | undefined;
    if (profileImage) {
      profileImageUrl = await this.storageService.upload(profileImage, 'riders/profiles');
    }

    const updateData = {
      ...updates,
      ...(profileImageUrl && { profileImage: profileImageUrl }),
    };

    const rider = await this.riderModel
      .findByIdAndUpdate(riderId, updateData, { new: true })
      .select('-password')
      .populate('vehicle');
    return {
      message: 'Profile updated successfully',
      data: rider,
    };
  }

  async deleteRider(id: string) {
    const rider = await this.riderModel.findByIdAndDelete(id);
    return {
      message: 'Rider deleted successfully',
      data: rider,
    };
  }
}
