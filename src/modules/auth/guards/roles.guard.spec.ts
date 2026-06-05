import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(() => {
    guard = new RolesGuard(mockReflector as any);
  });

  const createContext = (user: any) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;
  };

  it('debe permitir acceso si NO hay roles requeridos (metadata undefined)', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createContext({
      role: 'USER',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debe permitir acceso si el usuario tiene rol ADMIN requerido', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const context = createContext({
      role: 'ADMIN',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('debe denegar acceso si el rol no coincide', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const context = createContext({
      role: 'USER',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('debe denegar acceso si usuario no tiene role definido', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['ADMIN']);

    const context = createContext({
      role: undefined,
    });

    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('debe permitir múltiples roles (ADMIN o MODERATOR)', () => {
    mockReflector.getAllAndOverride.mockReturnValue([
      'ADMIN',
      'MODERATOR',
    ]);

    const context = createContext({
      role: 'MODERATOR',
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});