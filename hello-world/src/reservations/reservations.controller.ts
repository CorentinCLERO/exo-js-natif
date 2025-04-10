import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateReservationDto } from './reservations.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Request() req: { user: { sub: number; username: string } }) {
    return await this.reservationsService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createResevationDto: CreateReservationDto,
    @Request() req: { user: { sub: number; username: string } },
  ) {
    const { movieId, time } = createResevationDto;
    return await this.reservationsService.create(req.user.sub, time, movieId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:id')
  async deleteById(
    @Request() req: { user: { sub: number; username: string } },
    @Param('id') id: number,
  ) {
    return this.reservationsService.deleteById(req.user.sub, id);
  }
}
