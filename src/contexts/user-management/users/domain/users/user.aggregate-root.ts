import { EntityId, getNullOrValueField } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';

import { IProfileCreateData, IProfileUpdateData, Profile } from '../profiles';
import { UserCreatedEvent, UserUpdatedEvent } from './events';
import { UserSnapshot } from './user.snapshot';

const events = {
  UserCreatedEvent,
  UserUpdatedEvent,
};

export type UserEvents = typeof events;

export class User extends AggregateRoot {
  id: EntityId;

  email: string;

  profile: Profile;

  constructor(
    {
      id,
      email,
      profile,
    }: {
      id: EntityId;
      email: string;
      profile: Profile;
    },
    version?: number,
  ) {
    super(version);

    this.id = id;
    this.email = email;
    this.profile = profile;
  }

  public static create(
    {
      email,
      id,
      profile,
    }: {
      id?: EntityId;
      email: string;
      profile: IProfileCreateData;
    },
    version?: number,
  ): User {
    const user = new User(
      {
        id: id ?? EntityId.createRandom(),
        email,
        profile: Profile.create(profile),
      },
      version,
    );

    user.apply(
      new UserCreatedEvent({
        id: user.id,
        email: user.email,
        profile: user.profile,
      }),
    );

    return user;
  }

  update(user: UpdateUserData) {
    const potentialNewEmail = user.email ?? this.email;
    const potentialNewFirstName = getNullOrValueField(user.profile?.firstName, this.profile.firstName);
    const potentialNewLastName = getNullOrValueField(user.profile?.lastName, this.profile.lastName);
    const potentialNewUsername = getNullOrValueField(user.profile?.username, this.profile.username);
    const potentialNewAddress = getNullOrValueField(user.profile?.address, this.profile.address);
    const potentialNewBio = getNullOrValueField(user.profile?.bio, this.profile.bio);
    const potentialNewDateOfBirth = getNullOrValueField(user.profile?.dateOfBirth, this.profile.dateOfBirth);
    const potentialNewGender = getNullOrValueField(user.profile?.gender, this.profile.gender);
    const potentialNewHobbies = user.profile?.hobbies ?? this.profile.hobbies;
    const potentialNewLanguages = user.profile?.languages ?? this.profile.languages;
    const potentialNewPhoneNumber = getNullOrValueField(user.profile?.phoneNumber, this.profile.phoneNumber);
    const potentialNewProfilePicture = getNullOrValueField(user.profile?.profilePicture, this.profile.profilePicture);
    const potentialNewRodoAcceptanceDate = getNullOrValueField(user.profile?.rodoAcceptanceDate, this.profile.rodoAcceptanceDate);

    this.apply(
      new UserUpdatedEvent({
        id: this.id,
        email: potentialNewEmail,
        profile: {
          id: this.profile.id,
          userId: this.profile.userId,
          firstName: potentialNewFirstName,
          lastName: potentialNewLastName,
          username: potentialNewUsername,
          address: potentialNewAddress,
          bio: potentialNewBio,
          dateOfBirth: potentialNewDateOfBirth,
          gender: potentialNewGender,
          hobbies: potentialNewHobbies,
          languages: potentialNewLanguages,
          phoneNumber: potentialNewPhoneNumber,
          profilePicture: potentialNewProfilePicture,
          rodoAcceptanceDate: potentialNewRodoAcceptanceDate,
        },
      }),
    );
  }

  public static restoreFromSnapshot(dao: UserSnapshot): User {
    const rentalPeriod = new User(
      {
        id: new EntityId(dao.id),
        email: dao.email,
        profile: Profile.restoreFromSnapshot(dao.profile),
      },
      dao.version,
    );

    return rentalPeriod;
  }

  getId(): string {
    return this.id.value;
  }

  getEmail(): string {
    return this.email;
  }
}

type UpdateUserData = {
  email?: string;
  profile?: IProfileUpdateData;
};
