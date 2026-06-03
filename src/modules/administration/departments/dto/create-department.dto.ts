import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {

  @ApiProperty({
    example: 'Ingeniería en Sistemas',
    description: 'Nombre del departamento',
  })
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    example: 'Departamento encargado de programas de ingeniería',
    description: 'Descripción del departamento',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}