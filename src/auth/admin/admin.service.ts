import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Admin } from './admin.schema';
import { IAdmin } from './admin.schema';
import { AdminLoginDto, CreateAdminDto, AdminResponseDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<IAdmin>,
    private jwtService: JwtService,
  ) {}

  async register(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    const { email, password, name } = createAdminDto;

    // Check if admin already exists
    const existingAdmin = await this.adminModel.findOne({ email });
    if (existingAdmin) {
      throw new BadRequestException('Admin with this email already exists');
    }

    // Create new admin
    const admin = new this.adminModel({
      email,
      password,
      name,
      role: 'admin',
    });

    await admin.save();

    // Generate JWT token
    const token = this.jwtService.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      { expiresIn: '24h' },
    );

    return {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      accessToken: token,
    };
  }

  async login(adminLoginDto: AdminLoginDto): Promise<AdminResponseDto> {
    const { email, password } = adminLoginDto;

    // Find admin by email
    const admin = await this.adminModel.findOne({ email });
    if (!admin) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('Admin account is inactive');
    }

    // Compare passwords
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate JWT token
    const token = this.jwtService.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
      { expiresIn: '24h' },
    );

    return {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.isActive,
      accessToken: token,
    };
  }

  async validateAdminById(id: string): Promise<IAdmin> {
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return admin;
  }

  async getAllAdmins() {
    return this.adminModel.find().select('-password');
  }

  async getAdminById(id: string) {
    return this.adminModel.findById(id).select('-password');
  }

  async updateAdmin(id: string, updates: any) {
    return this.adminModel.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  }

  async deleteAdmin(id: string) {
    return this.adminModel.findByIdAndDelete(id);
  }
}
