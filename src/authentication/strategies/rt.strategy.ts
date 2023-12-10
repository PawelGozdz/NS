import { Injectable } from '@nestjs/common';

import config from '@config/app';
import { IUser, UnauthorizedError } from '@libs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services';
import { JwtPayload } from '../types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(private authService: AuthService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request?.cookies?.Refresh;
				},
			]),
			secretOrKey: config.JWT_REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<IUser> {
		const refreshToken = req.cookies?.Refresh;

		if (!refreshToken || typeof refreshToken !== 'string') {
			throw new UnauthorizedError();
		}

		const user = await this.authService.getUserById(payload.id);

		if (user) {
			req.user = user;
			req.refresh_token = refreshToken;

			return user;
		}

		throw new UnauthorizedError();
	}
}
