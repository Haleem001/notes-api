import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';

describe('NotesService', () => {
  let service: NotesService;
  const chainMock = {
    sort: jest.fn(),
  };
  const noteModelMock = {
    create: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    chainMock.sort.mockResolvedValue([]);
    noteModelMock.find.mockReturnValue(chainMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: noteModelMock,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns sorted notes by user', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const result = [{ _id: 'n1' }];
    chainMock.sort.mockResolvedValue(result);

    await expect(service.findAllByUser(userId)).resolves.toEqual(result);
    expect(noteModelMock.find).toHaveBeenCalledWith({
      userId: new Types.ObjectId(userId),
    });
    expect(chainMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it('throws when updating missing note', async () => {
    const userId = '507f1f77bcf86cd799439011';
    noteModelMock.findOneAndUpdate.mockResolvedValue(null);

    await expect(
      service.update(userId, '507f1f77bcf86cd799439012', { title: 't' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws when deleting missing note', async () => {
    const userId = '507f1f77bcf86cd799439011';
    noteModelMock.findOneAndDelete.mockResolvedValue(null);

    await expect(
      service.delete(userId, '507f1f77bcf86cd799439012'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
