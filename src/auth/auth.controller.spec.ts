import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('forwards signup to service', async () => {
    const dto = { name: 'A', email: 'a@test.com', password: 'secret1' };
    const result = { accessToken: 'token' };
    authServiceMock.signUp.mockResolvedValue(result);

    await expect(controller.signUp(dto)).resolves.toEqual(result);
    expect(authServiceMock.signUp).toHaveBeenCalledWith(dto);
  });

  it('forwards login to service', async () => {
    const dto = { email: 'a@test.com', password: 'secret1' };
    const result = { accessToken: 'token' };
    authServiceMock.signIn.mockResolvedValue(result);

    await expect(controller.signIn(dto)).resolves.toEqual(result);
    expect(authServiceMock.signIn).toHaveBeenCalledWith(dto);
  });
});
