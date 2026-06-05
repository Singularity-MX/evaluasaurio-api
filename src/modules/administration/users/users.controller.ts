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

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Administration - Users')
@Controller('admin/users')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
@Roles('ADMIN')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // =====================================
  // ROLES CATALOG
  // =====================================

  @Get('roles/catalog')
  @ApiOperation({
    summary:
      'Obtener catálogo de roles disponibles',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de roles para selección en frontend',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  getRolesCatalog() {
    return this.usersService.getRolesCatalog();
  }

  // =====================================
  // CREATE
  // =====================================

  @Post()
  @ApiOperation({
    summary: 'Crear usuario',
  })
  @ApiResponse({
    status: 201,
    description:
      'Usuario creado correctamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description:
      'Rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un usuario con ese correo',
  })
  create(
    @Body()
    dto: CreateUserDto,
  ) {
    return this.usersService.create(
      dto,
    );
  }

  // =====================================
  // GET ALL
  // =====================================

  @Get()
  @ApiOperation({
    summary:
      'Obtener listado de usuarios',
  })
  @ApiResponse({
    status: 200,
    description:
      'Listado de usuarios',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Sin permisos',
  })
  findAll() {
    return this.usersService.findAll();
  }

  // =====================================
  // GET ONE
  // =====================================

  @Get(':id')
  @ApiOperation({
    summary:
      'Obtener usuario por ID',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Usuario encontrado',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario no encontrado',
  })
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.usersService.findOne(
      BigInt(id),
    );
  }

  // =====================================
  // UPDATE
  // =====================================

  @Patch(':id')
  @ApiOperation({
    summary:
      'Actualizar usuario',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Usuario actualizado correctamente',
  })
  @ApiResponse({
    status: 400,
    description:
      'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario o rol no encontrado',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe un usuario con ese correo',
  })
  update(
    @Param('id')
    id: string,
    @Body()
    dto: UpdateUserDto,
  ) {
    return this.usersService.update(
      BigInt(id),
      dto,
    );
  }

  // =====================================
  // DELETE (SOFT DELETE)
  // =====================================

  @Delete(':id')
  @ApiOperation({
    summary:
      'Desactivar usuario',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description:
      'ID del usuario',
  })
  @ApiResponse({
    status: 200,
    description:
      'Usuario desactivado correctamente',
  })
  @ApiResponse({
    status: 401,
    description:
      'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description:
      'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description:
      'Usuario no encontrado',
  })
  remove(
    @Param('id')
    id: string,
  ) {
    return this.usersService.remove(
      BigInt(id),
    );
  }
}