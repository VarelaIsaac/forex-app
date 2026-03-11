import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class SignupDto {
  @ApiProperty({
    description: 'User email address',
    example: 'trader@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Trader',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    description: 'Whether this is a demo account for practice trading',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDemoAccount?: boolean;
}
