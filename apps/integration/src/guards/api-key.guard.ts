import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, IUser } from '@app/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(@InjectModel(User.name) private userModel: Model<IUser>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const apiKey = authHeader.split(' ')[1];

        if (!apiKey) {
            throw new UnauthorizedException('API Key is missing');
        }

        // Try to find user by test key or live key
        const user = await this.userModel.findOne({
            $or: [{ testPublicKey: apiKey }, { livePublicKey: apiKey }],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid API Key');
        }

        // Determine mode
        const mode = user.testPublicKey === apiKey ? 'test' : 'live';

        // Attach user and mode to request
        request.user = user;
        request.mode = mode;

        return true;
    }
}
