import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { ExtractJwt, Strategy } from 'passport-jwt';

import config from '@app/config';
import { AppUtils, EntityId, UnauthorizedError } from '@libs/common';

import { AuthService } from '../services';
import { JwtPayload } from '../types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          const accessToken = (req?.cookies?.Authentication as string) || this.parseCookies(req.headers.cookie ?? '')?.Authentication;
          return accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: config.appConfig.JWT_ACCESS_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  private parseCookies(cookieAsString: string) {
    return cookie.parse(cookieAsString ?? '');
  }

  async validate(req: Request, payload: JwtPayload) {
    const accessToken = (req?.cookies?.Authentication as string) || this.parseCookies(req.headers.cookie ?? '')?.Authentication;

    if (typeof accessToken !== 'string' || AppUtils.isEmpty(accessToken)) {
      throw new UnauthorizedError();
    }

    const userId = EntityId.create(payload.id);

    const user = await this.authService.getAuthenticatedUserWithJwt(userId.value);

    if (AppUtils.isNotEmpty(user)) {
      req.userData = {
        email: user.email,
        id: user.userId,
      };

      return user;
    }

    this.logger.error('User not found with provided access token');
    throw new UnauthorizedError();
  }
}
