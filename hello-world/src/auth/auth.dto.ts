// https://docs.nestjs.com/pipes#class-validator

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterDto {
  // https://docs.nestjs.com/openapi/cli-plugin
  @ApiProperty({ default: 'john.doe@email.com' })
  @IsString()
  email: string;

  @ApiProperty({ default: 'test' })
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty({ default: 'john.doe@email.com' })
  @IsString()
  email: string;

  @IsString()
  @ApiProperty({ default: 'test' })
  password: string;
}
