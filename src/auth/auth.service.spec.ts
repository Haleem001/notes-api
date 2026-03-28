import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const usersServiceMock = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };
  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects signup when email already exists', async () => {
    usersServiceMock.findByEmail.mockResolvedValue({ _id: 'u1' });

    await expect(
      service.signUp({ name: 'Alice', email: 'a@test.com', password: 'secret1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects login for invalid credentials', async () => {
    usersServiceMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.signIn({ email: 'a@test.com', password: 'secret1' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns token and user on login', async () => {
    const user = {
      _id: { toString: () => 'u1' },
      email: 'a@test.com',
      name: 'Alice',
      passwordHash: 'hash',
    };
    usersServiceMock.findByEmail.mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jwtServiceMock.signAsync.mockResolvedValue('token');

    await expect(
      service.signIn({ email: 'a@test.com', password: 'secret1' }),
    ).resolves.toEqual({
      accessToken: 'token',
      user: { id: 'u1', name: 'Alice', email: 'a@test.com' },
    });
  });
});
