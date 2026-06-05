import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogsService } from './audit-logs.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuditLogsService', () => {
  let service: AuditLogsService;

  const mockPrisma = {
    auditLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AuditLogsService>(AuditLogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe crear log completo correctamente', async () => {
    const payload = {
      userId: BigInt(1),
      action: 'CREATE',
      entityType: 'USER',
      entityId: BigInt(10),
      metadata: { test: true },
      ipAddress: '127.0.0.1',
    };

    const dbResult = { id: 1 };

    mockPrisma.auditLog.create.mockResolvedValue(dbResult);

    const result = await service.createLog(payload);

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: payload.userId,
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        metadataJson: payload.metadata,
        ipAddress: payload.ipAddress,
      },
    });

    expect(result).toEqual(dbResult);
  });

  it('debe crear log mínimo solo con action (edge case real)', async () => {
    const payload = {
      action: 'LOGIN',
    };

    const dbResult = { id: 2 };

    mockPrisma.auditLog.create.mockResolvedValue(dbResult);

    const result = await service.createLog(payload as any);

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        userId: undefined,
        action: 'LOGIN',
        entityType: undefined,
        entityId: undefined,
        metadataJson: undefined,
        ipAddress: undefined,
      },
    });

    expect(result).toEqual(dbResult);
  });

  it('debe manejar metadata compleja sin mutación', async () => {
    const metadata = {
      before: { name: 'A' },
      after: { name: 'B' },
      diff: ['name'],
    };

    mockPrisma.auditLog.create.mockResolvedValue({ id: 3 });

    await service.createLog({
      action: 'UPDATE',
      metadata,
    });

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadataJson: metadata,
        }),
      }),
    );
  });

  it('debe propagar error de Prisma (branch crítico)', async () => {
    mockPrisma.auditLog.create.mockRejectedValue(
      new Error('DB failure'),
    );

    await expect(
      service.createLog({
        action: 'ERROR_CASE',
      }),
    ).rejects.toThrow('DB failure');
  });

  it('debe mantener integridad de bigint sin conversión implícita', async () => {
    const userId = BigInt(999);

    mockPrisma.auditLog.create.mockResolvedValue({ id: 4 });

    await service.createLog({
      userId,
      action: 'BIGINT_TEST',
    });

    expect(mockPrisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId,
        }),
      }),
    );
  });
});