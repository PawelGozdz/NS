import { ProfileSnapshot } from '../profiles/profile.snapshot';

export type UserSnapshot = {
	id: string;
	email: string;
	profile: ProfileSnapshot;
	version: number;
};
