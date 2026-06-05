import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin@evaluasaurio.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123*',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: '1',
    description: 'ID del rol',
  })
  @IsString()
  @IsNotEmpty()
  roleId!: string;
}