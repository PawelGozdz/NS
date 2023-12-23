import { EntityId } from '@libs/common';

export type UserInfo = {
	id: string;
	email: string;
};

export abstract class IUsersQueryRepository {
	abstract getOneById(id: EntityId): Promise<UserInfo | undefined>;
	abstract getOneByEmail(email: string): Promise<UserInfo | undefined>;
}
