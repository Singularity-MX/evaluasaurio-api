import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    dto: CreateUserDto,
  ) {
    const exists =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (exists) {
      throw new ConflictException(
        'Ya existe un usuario con ese correo',
      );
    }

    const role =
      await this.prisma.role.findUnique({
        where: {
          id: BigInt(dto.roleId),
        },
      });

    if (!role) {
      throw new NotFoundException(
        'Rol no encontrado',
      );
    }

    const passwordHash =
      await bcrypt.hash(
        dto.password,
        10,
      );

    return this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        roleId: BigInt(dto.roleId),
      },
      include: {
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: {
        email: 'asc',
      },
    });
  }

  async findOne(
    id: bigint,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          role: true,
        },
      });

    if (!user) {
      throw new NotFoundException(
        'Usuario no encontrado',
      );
    }

    return user;
  }

  async update(
    id: bigint,
    dto: UpdateUserDto,
  ) {
    await this.findOne(id);

    if (dto.email) {
      const exists =
        await this.prisma.user.findFirst({
          where: {
            email: dto.email,
            NOT: {
              id,
            },
          },
        });

      if (exists) {
        throw new ConflictException(
          'Ya existe un usuario con ese correo',
        );
      }
    }

    if (dto.roleId) {
      const role =
        await this.prisma.role.findUnique({
          where: {
            id: BigInt(dto.roleId),
          },
        });

      if (!role) {
        throw new NotFoundException(
          'Rol no encontrado',
        );
      }
    }

    const data: any = {};

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.roleId) {
      data.roleId =
        BigInt(dto.roleId);
    }

    if (
      dto.active !== undefined
    ) {
      data.active = dto.active;
    }

    if (dto.password) {
      data.passwordHash =
        await bcrypt.hash(
          dto.password,
          10,
        );
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      include: {
        role: true,
      },
    });
  }

  async remove(
    id: bigint,
  ) {
    await this.findOne(id);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }

  async getRolesCatalog() {
    return this.prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}