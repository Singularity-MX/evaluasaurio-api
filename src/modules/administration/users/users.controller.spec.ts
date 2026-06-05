import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getRolesCatalog: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: mockUsersService,
          },
        ],
      }).compile();

    controller =
      module.get<UsersController>(
        UsersController,
      );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =====================================
  // CREATE
  // =====================================

  describe('create', () => {
    it('should create user', async () => {
      const dto = {
        email: 'admin@test.com',
        password: '123456',
        roleId: '1',
      };

      mockUsersService.create.mockResolvedValue(
        dto,
      );

      const result =
        await controller.create(dto);

      expect(
        mockUsersService.create,
      ).toHaveBeenCalledTimes(1);

      expect(
        mockUsersService.create,
      ).toHaveBeenCalledWith(dto);

      expect(result).toEqual(dto);
    });
  });

  // =====================================
  // FIND ALL
  // =====================================

  describe('findAll', () => {
    it('should return users', async () => {
      const users = [
        {
          id: 1n,
          email: 'admin@test.com',
        },
      ];

      mockUsersService.findAll.mockResolvedValue(
        users,
      );

      const result =
        await controller.findAll();

      expect(
        mockUsersService.findAll,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(users);
    });
  });

  // =====================================
  // FIND ONE
  // =====================================

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user = {
        id: 1n,
        email: 'admin@test.com',
      };

      mockUsersService.findOne.mockResolvedValue(
        user,
      );

      const result =
        await controller.findOne('1');

      expect(
        mockUsersService.findOne,
      ).toHaveBeenCalledTimes(1);

      expect(
        mockUsersService.findOne,
      ).toHaveBeenCalledWith(1n);

      expect(result).toEqual(user);
    });
  });

  // =====================================
  // UPDATE
  // =====================================

  describe('update', () => {
    it('should update user email', async () => {
      const dto = {
        email: 'new@test.com',
      };

      mockUsersService.update.mockResolvedValue(
        {
          id: 1n,
          ...dto,
        },
      );

      const result =
        await controller.update(
          '1',
          dto,
        );

      expect(
        mockUsersService.update,
      ).toHaveBeenCalledTimes(1);

      expect(
        mockUsersService.update,
      ).toHaveBeenCalledWith(
        1n,
        dto,
      );

      expect(result.id).toBe(1n);
    });

    it('should update user role', async () => {
      const dto = {
        roleId: '2',
      };

      mockUsersService.update.mockResolvedValue(
        {
          id: 1n,
          roleId: 2n,
        },
      );

      const result =
        await controller.update(
          '1',
          dto,
        );

      expect(
        mockUsersService.update,
      ).toHaveBeenCalledWith(
        1n,
        dto,
      );

      expect(result.id).toBe(1n);
    });

    it('should update active status', async () => {
      const dto = {
        active: false,
      };

      mockUsersService.update.mockResolvedValue(
        {
          id: 1n,
          active: false,
        },
      );

      const result =
        await controller.update(
          '1',
          dto,
        );

      expect(
        mockUsersService.update,
      ).toHaveBeenCalledWith(
        1n,
        dto,
      );

      expect(result.active).toBe(false);
    });
  });

  // =====================================
  // REMOVE
  // =====================================

  describe('remove', () => {
    it('should deactivate user', async () => {
      mockUsersService.remove.mockResolvedValue(
        {
          id: 1n,
          active: false,
        },
      );

      const result =
        await controller.remove('1');

      expect(
        mockUsersService.remove,
      ).toHaveBeenCalledTimes(1);

      expect(
        mockUsersService.remove,
      ).toHaveBeenCalledWith(1n);

      expect(result.active).toBeFalsy();
    });
  });

  // =====================================
  // ROLES CATALOG
  // =====================================

  describe('getRolesCatalog', () => {
    it('should return roles catalog', async () => {
      const roles = [
        {
          id: 1n,
          name: 'ADMIN',
        },
        {
          id: 2n,
          name: 'MODERATOR',
        },
      ];

      mockUsersService.getRolesCatalog.mockResolvedValue(
        roles,
      );

      const result =
        await controller.getRolesCatalog();

      expect(
        mockUsersService.getRolesCatalog,
      ).toHaveBeenCalledTimes(1);

      expect(result).toEqual(
        roles,
      );
    });

    it('should return empty roles catalog', async () => {
      mockUsersService.getRolesCatalog.mockResolvedValue(
        [],
      );

      const result =
        await controller.getRolesCatalog();

      expect(result).toEqual(
        [],
      );
    });
  });
});