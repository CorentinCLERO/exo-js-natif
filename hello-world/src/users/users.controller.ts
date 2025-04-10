import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'number', description: 'User ID' },
        email: { type: 'string', description: 'User email address' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getProfile(@Request() req: { user: { sub: number; email: string } }): {
    sub: number;
    email: string;
  } {
    return req.user;
  }
}
