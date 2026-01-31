import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { Anonymous } from '../../decorators/anonymous.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto, ModeResponseDto } from './dto/user-response.dto';

@ApiTags('Auth - User')
@Controller('auth/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Anonymous()
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account with both Test and Live API keys generated.',
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g., Email already exists).',
  })
  async register(@Body() userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Anonymous()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates a user and returns an access token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid credentials).',
  })
  async login(@Body() loginData: LoginUserDto) {
    return this.userService.login(loginData);
  }

  @ApiBearerAuth()
  @Patch('mode')
  @ApiOperation({
    summary: 'Toggle Test/Live Mode',
    description: 'Switches the user account between Test and Live modes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mode successfully toggled.',
    type: ModeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async toggleMode(@Req() req) {
    // req.user is populated by the JwtGuard (which extracts payload from token)
    // The payload structure is defined in userService.create/login: { sub: userId, email: ..., role: ... }
    return this.userService.toggleMode(req.user.sub);
  }
}
