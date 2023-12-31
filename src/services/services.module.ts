import { Module } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { UserModel } from './users';
import { UsersModule } from './users/identity.module';

const modules = [ObjectionModule.forFeature([UserModel]), UsersModule];

const interceptors = [];

@Module({
	imports: [...modules],
	providers: [...interceptors],
})
export class ServicesModule {}
