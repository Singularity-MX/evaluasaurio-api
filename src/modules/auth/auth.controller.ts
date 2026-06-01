import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshDto } from './dto/refresh.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}
@Throttle({
  default: {
    ttl: 60000,
    limit: 5,
  },
})
  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión',
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
  })
  async login(
    @Body() loginDto: LoginDto,
  ) {
    return this.authService.login(
      loginDto,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener usuario autenticado',
  })
  getMe(
    @CurrentUser() user: any,
  ) {
    return user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cerrar sesión',
  })
  async logout(
    @CurrentUser() user: any,
  ) {
    return this.authService.logout(
      BigInt(user.userId),
    );
  }
  @Post('refresh')
@ApiOperation({
  summary:
    'Renovar access token',
})
async refresh(
  @Body()
  dto: RefreshDto,
) {

  return this.authService.refresh(
    dto.refreshToken,
  );

}
}