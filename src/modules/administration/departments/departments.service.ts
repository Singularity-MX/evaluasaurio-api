import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateDepartmentDto,
  ) {
    return this.prisma.department.create({
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: bigint) {
    const department =
      await this.prisma.department.findUnique({
        where: {
          id,
        },
      });

    if (!department) {
      throw new NotFoundException(
        'Departamento no encontrado',
      );
    }

    return department;
  }

  async update(
    id: bigint,
    dto: UpdateDepartmentDto,
  ) {
    await this.findOne(id);

    return this.prisma.department.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);

    return this.prisma.department.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }
}