// https://docs.nestjs.com/pipes#class-validator

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  // https://docs.nestjs.com/openapi/cli-plugin
  @ApiProperty({
    description: 'Email address of the user',
    default: 'john.doe@test-email.com',
    format: 'email',
  })
  // https://github.com/typestack/class-validator?tab=readme-ov-file#validation-decorators
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    format: 'password',
    minLength: 6,
    maxLength: 32,
    default: 'test1234',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password cannot exceed 32 characters' })
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    default: 'john.doe@test-email.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    format: 'password',
    minLength: 6,
    maxLength: 32,
    default: 'test1234',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(32, { message: 'Password cannot exceed 32 characters' })
  password: string;
}
