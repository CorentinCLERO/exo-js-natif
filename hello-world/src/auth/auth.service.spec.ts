/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  // Mock des données
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
  };

  // Mock du repository
  const mockUserRepository = {
    findOneBy: jest.fn(),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: 1,
        ...user,
      }),
    ),
    create: jest.fn(),
  };

  // Mock du JwtService
  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mockToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    // Réinitialiser les mocks entre les tests
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      // Arrange
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue({
        id: 1,
        email: registerDto.email,
        password: 'hashedPassword',
      });

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(result).toEqual({ email: registerDto.email });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 8);
      expect(userRepository.save).toHaveBeenCalled();
      // Supprimez cette assertion si votre service n'utilise pas create
      // expect(userRepository.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      // Arrange
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: registerDto.email,
      });
    });
  });

  describe('login', () => {
    it('should login a user and return an access token', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result).toEqual({ accessToken: 'mockToken' });
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockUserRepository.findOneBy.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'WrongPassword!',
      };

      mockUserRepository.findOneBy.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: loginDto.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });
  });
});
