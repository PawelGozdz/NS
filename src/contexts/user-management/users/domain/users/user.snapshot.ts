import { ProfileSnapshot } from '../profiles';

export type UserSnapshot = {
  id: string;
  email: string;
  profile: ProfileSnapshot;
  version: number;
};
