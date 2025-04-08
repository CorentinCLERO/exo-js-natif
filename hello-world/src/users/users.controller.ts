import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Token valide',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'string' },
        username: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token invalide',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  getProfile(@Request() req: { user: { sub: number; username: string } }): {
    sub: number;
    username: string;
  } {
    return req.user;
  }
}
