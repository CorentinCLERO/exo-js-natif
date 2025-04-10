import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<{ email: string }> {
    const userInfo = await this.authService.register(registerDto);
    return userInfo;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: { example: { accessToken: 'string' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
