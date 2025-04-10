import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateReservationDto } from './reservations.dto';
import { Reservation } from './reservations.entity';

@ApiTags('Reservations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reservations for the logged-in user' })
  @ApiResponse({
    status: 200,
    description: 'List of user reservations.',
    type: [Reservation],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(
    @Request() req: { user: { sub: number; email: string } },
  ): Promise<Reservation[]> {
    return await this.reservationsService.findAll(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created',
    type: Reservation,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: CreateReservationDto })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req: { user: { sub: number; email: string } },
  ): Promise<Reservation> {
    const { movieId, time } = createReservationDto;
    return await this.reservationsService.create(req.user.sub, time, movieId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a reservation by ID' })
  @ApiResponse({
    status: 204,
    description: 'Reservation successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Reservation not found' })
  async deleteById(
    @Request() req: { user: { sub: number; email: string } },
    @Param('id') id: number,
  ): Promise<void> {
    await this.reservationsService.deleteById(req.user.sub, id);
  }
}
