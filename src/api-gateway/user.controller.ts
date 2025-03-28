import { Controller, Get, Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { AuthService, CookiesService } from '@app/contexts';

@Controller('user')
export class UserController {
  constructor(
    private readonly logger: PinoLogger,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(CookiesService) private readonly cookieService: CookiesService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  // @Public()
  @Get()
  findAll(): string {
    this.logger.warn({ abc: 1, ddd: { asdf: '111' } }, 'Hello world!s');
    return 'This action returns all userss';
  }
}
