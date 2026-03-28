import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

describe('NotesController', () => {
  let controller: NotesController;
  const notesServiceMock = {
    findAllByUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [{ provide: NotesService, useValue: notesServiceMock }],
    }).compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('returns current user notes', async () => {
    const user = { userId: 'u1', email: 'u@test.com' };
    const result = [{ _id: 'n1', title: 'Note' }];
    notesServiceMock.findAllByUser.mockResolvedValue(result);

    await expect(controller.findAll(user)).resolves.toEqual(result);
    expect(notesServiceMock.findAllByUser).toHaveBeenCalledWith('u1');
  });
});
