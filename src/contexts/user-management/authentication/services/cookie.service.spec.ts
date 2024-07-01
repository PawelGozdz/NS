import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestError } from '@libs/common';
import { catchActError } from '@libs/testing';

import { CookiesService } from './cookie.service';

describe('CookiesService', () => {
  let service: CookiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookiesService],
    }).compile();

    service = module.get<CookiesService>(CookiesService);
  });

  describe('getCookies', () => {
    describe('success', () => {
      it('should get cookies', () => {
        // Arrange
        const accessToken = 'access_token';
        const refreshToken = 'refresh_token';
        const accessCookie = { cookie: 'accessCookie' };
        const refreshCookie = { cookie: 'refreshCookie' };

        jest.spyOn(service, 'getCookieWithJwtAccessToken').mockReturnValue(accessCookie);
        jest.spyOn(service, 'getCookieWithJwtRefreshToken').mockReturnValue(refreshCookie);

        // Act
        const result = service.getCookies({ access_token: accessToken, refresh_token: refreshToken });

        // Assert
        expect(result).toEqual([accessCookie.cookie, refreshCookie.cookie]);
        expect(service.getCookieWithJwtAccessToken).toHaveBeenCalledWith(accessToken);
        expect(service.getCookieWithJwtRefreshToken).toHaveBeenCalledWith(refreshToken);
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('getCookieWithJwtAccessToken', () => {
    describe('success', () => {
      it('should get cookie with JWT access token', () => {
        // Arrange
        const token = 'access_token';

        // Act
        const cookie = service.getCookieWithJwtAccessToken(token);

        // Assert
        expect(cookie).toEqual({
          cookie: `Authentication=${token}; HttpOnly; Path=/; Max-Age=2m`,
        });
        expect(cookie).toMatchSnapshot();
      });
    });

    describe('failure', () => {
      it('should throw BadRequestError', () => {
        // Arrange
        const token = '';

        // Act
        const { error } = catchActError(() => service.getCookieWithJwtAccessToken(token));

        // Assert
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error).toMatchSnapshot();
      });
    });
  });

  describe('getCookieWithJwtRefreshToken', () => {
    describe('success', () => {
      it('should get cookie with JWT refresh token', () => {
        // Arrange
        const token = 'refresh_token';

        // Act
        const cookie = service.getCookieWithJwtRefreshToken(token);

        expect(cookie).toEqual({
          cookie: `Refresh=${token}; HttpOnly; Path=/; Max-Age=15m`,
        });
        expect(cookie).toMatchSnapshot();
      });
    });

    describe('failure', () => {
      it('should throw BadRequestError', () => {
        // Arrange
        const token = '';

        // Act
        const { error } = catchActError(() => service.getCookieWithJwtRefreshToken(token));

        // Assert
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error).toMatchSnapshot();
      });
    });
  });

  describe('getCookieForLogOut', () => {
    describe('success', () => {
      it('should return array of cookies', () => {
        // Act
        const result = service.getCookieForLogOut();

        // Assert
        expect(result).toEqual(['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0']);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
