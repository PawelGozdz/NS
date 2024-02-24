import { EntityId } from '@libs/common';

import { Profile } from './profile.entity';

export abstract class IProfilesCommandRepository {
	abstract save(user: Profile): Promise<void>;
	abstract getOneById(id: EntityId): Promise<Profile | undefined>;
	abstract getOneByUserId(email: string): Promise<Profile | undefined>;
}
