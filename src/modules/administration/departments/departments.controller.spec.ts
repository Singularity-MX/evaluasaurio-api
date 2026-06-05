import { Test, TestingModule } from '@nestjs/testing';

import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;

  const mockDepartmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [
          DepartmentsController,
        ],
        providers: [
          {
            provide: DepartmentsService,
            useValue:
              mockDepartmentsService,
          },
        ],
      }).compile();

    controller =
      module.get<DepartmentsController>(
        DepartmentsController,
      );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create department', async () => {
    mockDepartmentsService.create
      .mockResolvedValue({
        id: '1',
        name: 'Sistemas',
      });

    const result =
      await controller.create({
        name: 'Sistemas',
        description: 'Departamento',
      });

    expect(
      mockDepartmentsService.create,
    ).toHaveBeenCalled();

    expect(result.name)
      .toBe('Sistemas');
  });

  it('should return all departments', async () => {
    mockDepartmentsService.findAll
      .mockResolvedValue([
        {
          id: '1',
          name: 'Sistemas',
        },
      ]);

    const result =
      await controller.findAll();

    expect(
      mockDepartmentsService.findAll,
    ).toHaveBeenCalled();

    expect(result.length)
      .toBe(1);
  });

  it('should return one department', async () => {
    mockDepartmentsService.findOne
      .mockResolvedValue({
        id: '1',
        name: 'Sistemas',
      });

    const result =
      await controller.findOne('1');

    expect(
      mockDepartmentsService.findOne,
    ).toHaveBeenCalledWith(
      BigInt(1),
    );

    expect(result.name)
      .toBe('Sistemas');
  });

  it('should update department', async () => {
    mockDepartmentsService.update
      .mockResolvedValue({
        id: '1',
        name: 'Sistemas Actualizado',
      });

    const result =
      await controller.update(
        '1',
        {
          name:
            'Sistemas Actualizado',
        },
      );

    expect(
      mockDepartmentsService.update,
    ).toHaveBeenCalled();

    expect(result.name)
      .toBe(
        'Sistemas Actualizado',
      );
  });

  it('should deactivate department', async () => {
    mockDepartmentsService.remove
      .mockResolvedValue({
        id: '1',
        active: false,
      });

    const result =
      await controller.remove(
        '1',
      );

    expect(
      mockDepartmentsService.remove,
    ).toHaveBeenCalledWith(
      BigInt(1),
    );

    expect(result.active)
      .toBe(false);
  });
});