import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';

// Créer un mock pour JwtAuthGuard
jest.mock('../auth/auth.guard.ts', () => ({
  JwtAuthGuard: jest.fn().mockImplementation(() => ({
    canActivate: jest.fn().mockReturnValue(true),
  })),
}));

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user data from request', () => {
    const req = {
      user: {
        sub: 1,
        email: 'test@example.com',
      },
    };

    expect(controller.getProfile(req)).toEqual(req.user);
  });
});
