import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new User' })
  async register(@Body() registerDto: RegisterDto): Promise<{ email: string }> {
    const userInfo = await this.authService.register(registerDto);
    return userInfo;
  }

  @Post('/login')
  @ApiOperation({ summary: 'Login a user' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }
}
