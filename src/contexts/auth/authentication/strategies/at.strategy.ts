import config from '@config/app';
import { EntityId, IAuthUser, UnauthorizedError } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as cookie from 'cookie';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services';
import { JwtPayload } from '../types';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(private readonly authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					const accessToken = req?.cookies?.Authentication || this.parseCookies(req.headers.cookie || '')?.Authentication;
					return accessToken;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: config.JWT_ACCESS_TOKEN_SECRET,
			passReqToCallback: true,
		});
	}

	private parseCookies(cookieAsString: string) {
		return cookie.parse(cookieAsString || '');
	}

	async validate(req: Request, payload: JwtPayload): Promise<IAuthUser> {
		const accessToken = req?.cookies?.Authentication || this.parseCookies(req.headers.cookie || '')?.Authentication;

		if (!accessToken || typeof accessToken !== 'string' || accessToken === '') {
			throw new UnauthorizedError();
		}

		const userId = EntityId.create(payload.id);

		const user = await this.authService.getAuthenticatedUserWithJwt(userId.value);

		if (user) {
			req.authUser = user;

			req.user = {
				email: user.email,
				id: user.userId,
			};

			return req.authUser;
		}

		throw new UnauthorizedError();
	}
}
