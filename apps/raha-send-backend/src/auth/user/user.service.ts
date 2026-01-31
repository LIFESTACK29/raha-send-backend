import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { User, IUser } from '@app/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  private generateApiKey(
    type: 'public' | 'secret',
    mode: 'test' | 'live',
  ): string {
    const prefix = type === 'public' ? 'pk' : 'sk';
    const randomPart = crypto.randomBytes(24).toString('hex');
    return `${prefix}_${mode}_${randomPart}`;
  }

  async create(
    userData: Partial<IUser>,
  ): Promise<{ user: any; accessToken: string }> {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const testPublicKey = this.generateApiKey('public', 'test');
    const testSecretKey = this.generateApiKey('secret', 'test');
    const livePublicKey = this.generateApiKey('public', 'live');
    const liveSecretKey = this.generateApiKey('secret', 'live');

    const newUser = new this.userModel({
      ...userData,
      isLiveMode: false, // Default to test mode
      testPublicKey,
      testSecretKey,
      livePublicKey,
      liveSecretKey,
    });

    await newUser.save();

    const payload = { sub: newUser._id, email: newUser.email, role: 'user' };
    const accessToken = await this.jwtService.signAsync(payload);

    // Return user without password
    const userObject: any = newUser.toObject();
    delete userObject.password;

    return {
      user: userObject,
      accessToken,
    };
  }

  async login(loginData: {
    email: string;
    password: string;
  }): Promise<{ accessToken: string; user: any }> {
    const user = await this.userModel.findOne({ email: loginData.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await (user as any).comparePassword(
      loginData.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: 'user' };
    const accessToken = await this.jwtService.signAsync(payload);

    const userObject: any = user.toObject();
    delete userObject.password;

    return {
      accessToken,
      user: userObject,
    };
  }

  async toggleMode(userId: string): Promise<{ isLiveMode: boolean }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.isLiveMode = !user.isLiveMode;
    await user.save();

    return { isLiveMode: user.isLiveMode };
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId).exec();
  }
}
