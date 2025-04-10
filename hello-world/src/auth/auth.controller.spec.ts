/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Mock des données
  const mockRegisterDto: RegisterDto = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'Password123!',
  };

  const mockRegisteredUser = {
    email: 'test@example.com',
  };

  const mockLoginResponse = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  };

  // Mock du service
  const mockAuthService = {
    register: jest.fn().mockImplementation((registerDto: RegisterDto) => {
      return Promise.resolve({ email: registerDto.email });
    }),
    login: jest.fn().mockImplementation(() => {
      return Promise.resolve({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      });
    }),
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
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // Act
      const result = await controller.register(mockRegisterDto);

      // Assert
      expect(result).toEqual(mockRegisteredUser);
      expect(service.register).toHaveBeenCalledWith(mockRegisterDto);
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(result).toEqual(mockLoginResponse);
      expect(service.login).toHaveBeenCalledWith(mockLoginDto);
    });
  });
});
