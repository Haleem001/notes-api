import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  const userModelMock = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('normalizes email for findByEmail', async () => {
    const query = { email: 'a@test.com' };
    userModelMock.findOne.mockResolvedValue(null);

    await service.findByEmail('A@Test.com');

    expect(userModelMock.findOne).toHaveBeenCalledWith(query);
  });

  it('creates user with lowercased email', async () => {
    userModelMock.create.mockResolvedValue({ _id: 'u1' });

    await service.createUser({
      name: 'Alice',
      email: 'A@Test.com',
      passwordHash: 'hash',
    });

    expect(userModelMock.create).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'a@test.com',
      passwordHash: 'hash',
    });
  });
});
