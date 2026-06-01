import { Injectable, UnauthorizedException } from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { AuditLogsService } from "../audit-logs/audit-logs.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      await this.auditLogsService.createLog({
        action: "LOGIN_FAILED",
        metadata: {
          email: loginDto.email,
          reason: "USER_NOT_FOUND",
        },
      });
      throw new UnauthorizedException("Credenciales inválidas");
    }
    if (!user.active) {
      await this.auditLogsService.createLog({
        userId: user.id,
        action: "LOGIN_FAILED",
        metadata: {
          email: user.email,
          reason: "USER_DISABLED",
        },
      });
      throw new UnauthorizedException("Usuario deshabilitado");
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      await this.auditLogsService.createLog({
        userId: user.id,
        action: "LOGIN_FAILED",
        metadata: {
          email: user.email,
          reason: "INVALID_PASSWORD",
        },
      });
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const payload = {
      sub: user.id.toString(),
      email: user.email,
      role: user.role.name,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: "15m",
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "30d",
    });

    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        refreshTokenHash: refreshHash,
      },
    });

    await this.auditLogsService.createLog({
      userId: user.id,
      action: "LOGIN_SUCCESS",
      metadata: {
        email: user.email,
        role: user.role.name,
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role.name,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = await this.prisma.user.findUnique({
        where: {
          id: BigInt(payload.sub),
        },
        include: {
          role: true,
        },
      });
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException();
      }
      const valid = await bcrypt.compare(
        refreshToken,
        user.refreshTokenHash,
      );
      if (!valid) {
        throw new UnauthorizedException();
      }
      const newPayload = {
        sub: user.id.toString(),
        email: user.email,
        role: user.role.name,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: "15m",
      });
      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: "30d",
      });
      const refreshHash = await bcrypt.hash(newRefreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          refreshTokenHash: refreshHash,
          lastLoginAt: new Date(),
        },
      });

      await this.auditLogsService.createLog({
        userId: user.id,
        action: "TOKEN_REFRESH",
        metadata: {
          email: user.email,
        },
      });
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException("Refresh token inválido");
    }
  }

  async logout(userId: bigint) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenHash: null,
      },
    });
    await this.auditLogsService.createLog({
      userId,
      action: "LOGOUT",
    });
    return {
      message: "Sesión cerrada correctamente",
    };
  }
}
