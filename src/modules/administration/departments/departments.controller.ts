import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Administration - Departments')
@Controller('admin/departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
  ) {}

  // =====================================
  // CREATE
  // =====================================

  @Post()
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear departamento',
  })
  @ApiResponse({
    status: 201,
    description: 'Departamento creado correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  create(
    @Body() dto: CreateDepartmentDto,
  ) {
    return this.departmentsService.create(
      dto,
    );
  }

  // =====================================
  // GET ALL (PUBLICO)
  // =====================================

  @Get()
  @ApiOperation({
    summary:
      'Obtener todos los departamentos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de departamentos',
  })
  findAll() {
    return this.departmentsService.findAll();
  }

  // =====================================
  // GET ONE (PUBLICO)
  // =====================================

  @Get(':id')
  @ApiOperation({
    summary:
      'Obtener departamento por ID',
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

  // =====================================
  // UPDATE
  // =====================================

  @Patch(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Actualizar departamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
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

  // =====================================
  // DELETE (SOFT DELETE)
  // =====================================

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Desactivar departamento',
  })
  @ApiParam({
    name: 'id',
    example: 1,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  remove(
    @Param('id') id: string,
  ) {
    return this.departmentsService.remove(
      BigInt(id),
    );
  }
}