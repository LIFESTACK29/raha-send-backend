import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rider } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateRiderDto } from './dto/create-rider.dto';
import { LoginRiderDto } from './dto/login-rider.dto';

@Injectable()
export class RiderService {
    constructor(
        @InjectModel(Rider.name) private riderModel: Model<Rider>,
        private jwtService: JwtService,
    ) { }

    async register(createRiderDto: CreateRiderDto) {
        const existingRider = await this.riderModel.findOne({
            $or: [
                { email: createRiderDto.email },
                { phone: createRiderDto.phone },
            ],
        });

        if (existingRider) {
            throw new BadRequestException('Rider with this email or phone already exists');
        }

        // Password hashing handled by pre-save hook in schema
        const rider = new this.riderModel(createRiderDto);
        await rider.save();

        return {
            message: 'Rider registered successfully',
            riderId: rider._id,
        };
    }

    async login(loginRiderDto: LoginRiderDto) {
        const rider = await this.riderModel.findOne({ email: loginRiderDto.email });
        if (!rider) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await (rider as any).comparePassword(loginRiderDto.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: rider._id, role: 'rider' };

        return {
            access_token: this.jwtService.sign(payload),
            rider: {
                id: rider._id,
                firstName: rider.firstName,
                lastName: rider.lastName,
                email: rider.email,
                status: rider.status
            }
        };
    }

    async findOne(id: string) {
        return this.riderModel.findById(id).exec();
    }
}
