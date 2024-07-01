import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';

import { HashService } from './hash.service';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should verify password', async () => {
    // Arrange
    const hash = 'hash';
    const password = 'password';
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    // Act
    const result = await service.verifyPassword(hash, password);

    // Assert
    expect(result).toBe(true);
    expect(argon2.verify).toHaveBeenCalledWith(hash, password);
    expect(result).toMatchSnapshot();
  });

  it('should hash data', async () => {
    // Arrange
    const data = 'data';
    const hashedData = 'hashedData';
    (argon2.hash as jest.Mock).mockResolvedValue(hashedData);

    // Act
    const result = await service.hashData(data);

    // Assert
    expect(result).toBe(hashedData);
    expect(argon2.hash).toHaveBeenCalledWith(data, { timeCost: 6 });
    expect(result).toMatchSnapshot();
  });

  it('should verify hash and text', async () => {
    // Arrange
    const hash = 'hash';
    const text = 'text';
    (argon2.verify as jest.Mock).mockResolvedValue(true);

    // Act
    const result = await service.hashAndTextVerify(hash, text);

    // Assert
    expect(result).toBe(true);
    expect(argon2.verify).toHaveBeenCalledWith(hash, text);
    expect(result).toMatchSnapshot();
  });

  it('should return false if hash or text is not provided', async () => {
    // Act
    const result = await service.hashAndTextVerify('', '');

    // Assert
    expect(result).toBe(false);
    expect(result).toMatchSnapshot();
  });
});
