import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, Strategy } from 'passport-jwt';

import config from '@app/config';
import { AppUtils, EntityId, UnauthorizedError } from '@libs/common';

import { AuthUser } from '../models';
import { AuthService } from '../services';
import { JwtPayload } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const token = (req?.cookies?.Refresh as string) || this.parseCookies(req.headers.cookie ?? '')?.Refresh;
          return token;
        },
      ]),
      secretOrKey: config.appConfig.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  private parseCookies(cookieAsString: string) {
    return cookie.parse(cookieAsString || '');
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
    const refreshToken = (req?.cookies?.Refresh as string) || this.parseCookies(req.headers.cookie ?? '')?.Refresh;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new UnauthorizedError();
    }

    const userId = EntityId.create(payload.id);

    const user = await this.authService.getAuthenticatedUserWithRefreshToken(userId.value, refreshToken);

    if (!AppUtils.isEmpty(user)) {
      req.authUser = user;

      req.user = {
        email: user.email,
        id: user.userId,
      };

      req.refreshToken = refreshToken;

      return user;
    }

    this.logger.error('User not found with provided refresh token');
    throw new UnauthorizedError();
  }
}
