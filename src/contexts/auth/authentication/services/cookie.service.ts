import config from '@app/config';
import { BadRequestError } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CookiesService {
	public getCookieWithJwtAccessToken(accessToken: string) {
		if (!accessToken) {
			throw new BadRequestError('Provide all the data!');
		}

		return {
			cookie: `Authentication=${accessToken}; HttpOnly; Path=/; Max-Age=${config.appConfig.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
		};
	}

	public getCookies({ access_token, refresh_token }: { access_token: string; refresh_token: string }) {
		return [this.getCookieWithJwtAccessToken(access_token).cookie, this.getCookieWithJwtRefreshToken(refresh_token).cookie];
	}

	public getCookieWithJwtRefreshToken(refreshToken: string) {
		if (!refreshToken) {
			throw new BadRequestError('Provide all the data!');
		}

		return {
			cookie: `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${config.appConfig.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
		};
	}

	public getCookieForLogOut() {
		return ['Authentication=; HttpOnly; Path=/; Max-Age=0', 'Refresh=; HttpOnly; Path=/; Max-Age=0'];
	}
}
