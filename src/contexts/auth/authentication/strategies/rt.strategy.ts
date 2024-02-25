import config from '@app/config';
import { EntityId, UnauthorizedError } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUser } from '../models';
import { AuthService } from '../services';
import { JwtPayload } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const token = req?.cookies?.Refresh || this.parseCookies(req.headers.cookie || '')?.Refresh;
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
		const refreshToken = req?.cookies?.Refresh || this.parseCookies(req.headers.cookie || '')?.Refresh;

		if (!refreshToken || typeof refreshToken !== 'string') {
			throw new UnauthorizedError();
		}

		const userId = EntityId.create(payload.id);

		const user = await this.authService.getAuthenticatedUserWithRefreshToken(userId.value, refreshToken);

		if (user) {
			req.authUser = user;

			req.user = {
				email: user.email,
				id: user.userId,
			};

			req.refreshToken = refreshToken;

			return user;
		}

		throw new UnauthorizedError();
	}
}
