import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call login', async () => {
    mockAuthService.login.mockResolvedValue({
      accessToken: 'token',
    });

    const result = await controller.login({
      email: 'test@test.com',
      password: '123456',
    } as any);

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(result.accessToken).toBe('token');
  });

  it('should call refresh', async () => {
    mockAuthService.refresh.mockResolvedValue({
      accessToken: 'new-token',
    });

    const result = await controller.refresh({
      refreshToken: 'refresh',
    });

    expect(result.accessToken).toBe('new-token');
  });

  it('should call logout', async () => {
    mockAuthService.logout.mockResolvedValue({
      message: 'ok',
    });

    const result = await controller.logout({
      userId: '1',
    } as any);

    expect(result.message).toBe('ok');
  });
});