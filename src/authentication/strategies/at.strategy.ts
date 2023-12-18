import config from '@config/app';
import { IUser, UnauthorizedError } from '@libs/common';
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

	async validate(req: Request, payload: JwtPayload): Promise<IUser> {
		const accessToken = req?.cookies?.Authentication || this.parseCookies(req.headers.cookie || '')?.Authentication;

		if (!accessToken || typeof accessToken !== 'string' || accessToken === '') {
			throw new UnauthorizedError();
		}

		const user = await this.authService.getUserById(payload.id);

		if (user) {
			req.user = user;
			return user;
		}

		throw new UnauthorizedError();
	}
}
