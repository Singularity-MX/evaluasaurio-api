import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditLogsService } from "../audit-logs/audit-logs.service";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");

describe("AuthService", () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockAuditLogsService = {
    createLog: jest.fn(),
  };

  const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // =========================
  // LOGIN SUCCESS
  // =========================
  it("should login successfully", async () => {
    const user = {
      id: BigInt(1),
      email: "test@test.com",
      active: true,
      passwordHash: "hashed",
      role: { name: "ADMIN" },
    };

    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockedBcrypt.compare.mockResolvedValue(true as never);

    mockJwtService.signAsync
      .mockResolvedValueOnce("access-token")
      .mockResolvedValueOnce("refresh-token");

    mockPrisma.user.update.mockResolvedValue(user);

    const result = await service.login({
      email: "test@test.com",
      password: "123",
    } as any);

    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(result.user.email).toBe("test@test.com");

    expect(mockPrisma.user.update).toHaveBeenCalled();

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGIN_SUCCESS",
      }),
    );
  });

  // =========================
  // USER NOT FOUND
  // =========================
  it("should throw if user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: "no@test.com",
        password: "123",
      } as any),
    ).rejects.toThrow("Credenciales inválidas");

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGIN_FAILED",
      }),
    );

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  // =========================
  // USER DISABLED
  // =========================
  it("should throw if user is disabled", async () => {
    const user = {
      id: BigInt(1),
      email: "test@test.com",
      active: false,
      passwordHash: "hashed",
      role: { name: "ADMIN" },
    };

    mockPrisma.user.findUnique.mockResolvedValue(user);

    await expect(
      service.login({
        email: "test@test.com",
        password: "123",
      } as any),
    ).rejects.toThrow("Usuario deshabilitado");

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGIN_FAILED",
      }),
    );

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  // =========================
  // INVALID PASSWORD
  // =========================
  it("should throw if password is invalid", async () => {
    const user = {
      id: BigInt(1),
      email: "test@test.com",
      active: true,
      passwordHash: "hashed",
      role: { name: "ADMIN" },
    };

    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockedBcrypt.compare.mockResolvedValue(false as never);

    await expect(
      service.login({
        email: "test@test.com",
        password: "wrong",
      } as any),
    ).rejects.toThrow("Credenciales inválidas");

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGIN_FAILED",
      }),
    );

    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  // =========================
  // REFRESH TOKEN SUCCESS
  // =========================
  it("should refresh token successfully", async () => {
    mockJwtService.verifyAsync.mockResolvedValue({
      sub: "1",
      email: "test@test.com",
      role: "ADMIN",
    });

    const user = {
      id: BigInt(1),
      email: "test@test.com",
      refreshTokenHash: "hash",
      role: { name: "ADMIN" },
    };

    mockPrisma.user.findUnique.mockResolvedValue(user);
    mockedBcrypt.compare.mockResolvedValue(true as never);

    mockJwtService.signAsync
      .mockResolvedValueOnce("new-access")
      .mockResolvedValueOnce("new-refresh");

    mockPrisma.user.update.mockResolvedValue(user);

    const result = await service.refresh("refresh-token");

    expect(result.accessToken).toBe("new-access");
    expect(result.refreshToken).toBe("new-refresh");

    expect(mockPrisma.user.update).toHaveBeenCalled();

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "TOKEN_REFRESH",
      }),
    );
  });

  // =========================
  // LOGOUT
  // =========================
  it("should logout successfully", async () => {
    mockPrisma.user.update.mockResolvedValue(true);

    const result = await service.logout(BigInt(1));

    expect(result.message).toBe("Sesión cerrada correctamente");

    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          refreshTokenHash: null,
        },
      }),
    );

    expect(mockAuditLogsService.createLog).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "LOGOUT",
      }),
    );
  });
  it('should fail refresh if token invalid', async () => {
  mockJwtService.verifyAsync.mockRejectedValue(new Error('bad'));

  await expect(service.refresh('bad-token')).rejects.toThrow(
    'Refresh token inválido',
  );
});

it('should fail refresh if user not found', async () => {
  mockJwtService.verifyAsync.mockResolvedValue({ sub: '1' });
  mockPrisma.user.findUnique.mockResolvedValue(null);

  await expect(service.refresh('token')).rejects.toThrow(
    'Refresh token inválido',
  );
});

it('should fail refresh if bcrypt mismatch', async () => {
  mockJwtService.verifyAsync.mockResolvedValue({ sub: '1' });

  mockPrisma.user.findUnique.mockResolvedValue({
    id: 1n,
    refreshTokenHash: 'hash',
    role: { name: 'ADMIN' },
  });

  mockedBcrypt.compare.mockResolvedValue(false as never);

  await expect(service.refresh('token')).rejects.toThrow(
    'Refresh token inválido',
  );
});
});