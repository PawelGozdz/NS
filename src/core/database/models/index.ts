import { IAuthUserModel } from './auth-user-model.interface';
import { ICategoryModel } from './category-model.interface';
import { IEventLogModel } from './eventlog-model.interface';
import { IJobUserProfileModel } from './job-user-profile-model.interface';
import { IOutboxModel } from './outbox-model.interface';
import { IUserProfileModel } from './profile-model.interface';
import { ISkillModel } from './skill-model.interface';
import { IUserModel } from './user-model.interface';

export * from './auth-user-model.interface';
export * from './category-model.interface';
export * from './eventlog-model.interface';
export * from './job-user-profile-model.interface';
export * from './outbox-model.interface';
export * from './profile-model.interface';
export * from './skill-model.interface';
export * from './user-model.interface';

export type IDatabaseModels = {
  authUsers: IAuthUserModel;
  users: IUserModel;
  userProfiles: IUserProfileModel;
  skills: ISkillModel;
  categories: ICategoryModel;
  eventLogs: IEventLogModel;
  outbox: IOutboxModel;
  jobUserProfiles: IJobUserProfileModel;
};
