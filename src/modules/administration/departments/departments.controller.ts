import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { DepartmentsService } from './departments.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('Administration - Departments')
@ApiBearerAuth()
@Controller('admin/departments')
export class DepartmentsController {

  constructor(
    private readonly departmentsService: DepartmentsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Crear departamento',
  })
  @ApiResponse({
    status: 201,
    description: 'Departamento creado correctamente',
  })
  create(
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.departmentsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los departamentos',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de departamentos',
  })
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener departamento por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  findOne(
    @Param('id') id: string,
  ) {
    return this.departmentsService.findOne(
      BigInt(id),
    );
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar departamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return this.departmentsService.update(
      BigInt(id),
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Desactivar departamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.departmentsService.remove(
      BigInt(id),
    );
  }
}