import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';
import { PrismaService } from '../../../prisma/prisma.service';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    role: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: PrismaService,
            useValue: prismaMock,
          },
        ],
      }).compile();

    service =
      module.get<UsersService>(
        UsersService,
      );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        null,
      );

      prismaMock.role.findUnique.mockResolvedValue(
        {
          id: 1n,
          name: 'ADMIN',
        },
      );

      (
        bcrypt.hash as jest.Mock
      ).mockResolvedValue(
        'hashed-password',
      );

      prismaMock.user.create.mockResolvedValue(
        {
          id: 1n,
        },
      );

      await service.create({
        email: 'admin@test.com',
        password: '123456',
        roleId: '1',
      });

      expect(
        bcrypt.hash,
      ).toHaveBeenCalledWith(
        '123456',
        10,
      );

      expect(
        prismaMock.user.create,
      ).toHaveBeenCalled();
    });

    it('should throw if email exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      await expect(
        service.create({
          email: 'admin@test.com',
          password: '123456',
          roleId: '1',
        }),
      ).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw if role does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        null,
      );

      prismaMock.role.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.create({
          email: 'admin@test.com',
          password: '123456',
          roleId: '99',
        }),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      prismaMock.user.findMany.mockResolvedValue(
        [],
      );

      const result =
        await service.findAll();

      expect(
        prismaMock.user.findMany,
      ).toHaveBeenCalled();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      const result =
        await service.findOne(1n);

      expect(result.id).toBe(1n);
    });

    it('should throw not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.findOne(1n),
      ).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.user.findFirst.mockResolvedValue(
        null,
      );

      prismaMock.user.update.mockResolvedValue(
        {
          id: 1n,
        },
      );

      const result =
        await service.update(
          1n,
          {
            email:
              'new@test.com',
          },
        );

      expect(result.id).toBe(1n);
    });

    it('should throw if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.user.findFirst.mockResolvedValue(
        {
          id: 2n,
        },
      );

      await expect(
        service.update(
          1n,
          {
            email:
              'duplicate@test.com',
          },
        ),
      ).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw if role does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.role.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.update(
          1n,
          {
            roleId: '99',
          },
        ),
      ).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update role', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.role.findUnique.mockResolvedValue(
        {
          id: 2n,
        },
      );

      prismaMock.user.update.mockResolvedValue(
        {
          id: 1n,
        },
      );

      const result =
        await service.update(
          1n,
          {
            roleId: '2',
          },
        );

      expect(result.id).toBe(1n);
    });

    it('should update password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      (
        bcrypt.hash as jest.Mock
      ).mockResolvedValue(
        'hashed-password',
      );

      prismaMock.user.update.mockResolvedValue(
        {
          id: 1n,
        },
      );

      const result =
        await service.update(
          1n,
          {
            password:
              'new-password',
          },
        );

      expect(
        bcrypt.hash,
      ).toHaveBeenCalledWith(
        'new-password',
        10,
      );

      expect(result.id).toBe(1n);
    });

    it('should update active status', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.user.update.mockResolvedValue(
        {
          id: 1n,
          active: false,
        },
      );

      const result =
        await service.update(
          1n,
          {
            active: false,
          },
        );

      expect(
        result.active,
      ).toBe(false);
    });
  });

  describe('remove', () => {
    it('should deactivate user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(
        {
          id: 1n,
        },
      );

      prismaMock.user.update.mockResolvedValue(
        {
          id: 1n,
          active: false,
        },
      );

      const result =
        await service.remove(1n);

      expect(
        result.active,
      ).toBeFalsy();
    });
  });

  describe('getRolesCatalog', () => {
    it('should return roles', async () => {
      prismaMock.role.findMany.mockResolvedValue(
        [
          {
            id: 1n,
            name: 'ADMIN',
          },
        ],
      );

      const result =
        await service.getRolesCatalog();

      expect(
        result[0].name,
      ).toBe('ADMIN');
    });
  });
});