import { Module } from '@nestjs/common';

import { AuthenticationModule } from './authentication';
import { UsersModule } from './users';

@Module({
  imports: [UsersModule, AuthenticationModule],
  exports: [UsersModule, AuthenticationModule],
})
export class UserManagementModule {}
