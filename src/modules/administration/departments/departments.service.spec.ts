import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  const mockPrisma = {
    department: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          DepartmentsService,
          {
            provide: PrismaService,
            useValue: mockPrisma,
          },
        ],
      }).compile();

    service = module.get(DepartmentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ================= CREATE =================
  describe('create', () => {
    it('should create department', async () => {
      mockPrisma.department.findUnique.mockResolvedValue(null);
      mockPrisma.department.create.mockResolvedValue({
        id: 1n,
        name: 'Sistemas',
      });

      const result = await service.create({
        name: 'Sistemas',
      } as any);

      expect(result.name).toBe('Sistemas');
      expect(mockPrisma.department.create).toHaveBeenCalled();
    });

    it('should throw conflict if exists', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({
        id: 1n,
      });

      await expect(
        service.create({ name: 'Sistemas' } as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ================= UPDATE (COVER BRANCHES) =================
  describe('update', () => {
    it('should update department successfully', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({
        id: 1n,
      });

      mockPrisma.department.findFirst.mockResolvedValue(null);

      mockPrisma.department.update.mockResolvedValue({
        id: 1n,
        name: 'Nuevo',
      });

      const result = await service.update(1n, {
        name: 'Nuevo',
      } as any);

      expect(result.name).toBe('Nuevo');
    });

    it('should throw conflict when name already exists', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({
        id: 1n,
      });

      mockPrisma.department.findFirst.mockResolvedValue({
        id: 2n,
        name: 'Duplicado',
      });

      await expect(
        service.update(1n, { name: 'Duplicado' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow update when no name provided (branch dto.name undefined)', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({
        id: 1n,
      });

      mockPrisma.department.update.mockResolvedValue({
        id: 1n,
      });

      await service.update(1n, {} as any);

      expect(mockPrisma.department.findFirst).not.toHaveBeenCalled();
    });
  });

  // ================= REMOVE =================
  describe('remove', () => {
    it('should deactivate department', async () => {
      mockPrisma.department.findUnique.mockResolvedValue({
        id: 1n,
      });

      mockPrisma.department.update.mockResolvedValue({
        id: 1n,
        active: false,
      });

      const result = await service.remove(1n);

      expect(result.active).toBe(false);
    });

    it('should throw not found if missing', async () => {
      mockPrisma.department.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999n)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  
});