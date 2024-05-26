import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { IDatabaseModels, TableNames } from '@app/core';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';

import { IUsersCommandRepository, User, UserCreatedEvent, UserSnapshot } from '../../domain';
import { UserModel, UserProfileModel } from '../models';

@Injectable()
export class UsersCommandRepository extends EntityRepository implements IUsersCommandRepository {
  constructor(
    eventBus: EventBus,
    private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>,
  ) {
    super(eventBus, UserModel, txHost);
  }

  async getOneById(id: EntityId): Promise<User | undefined> {
    const user = (await this.getUserAndProfile().where('u.id', '=', id.value).executeTakeFirst()) as UserModel | undefined;

    if (!user) {
      return undefined;
    }

    const snapshot = this.userToSnapshot(user);

    return User.restoreFromSnapshot(snapshot);
  }

  async getOneByEmail(email: string): Promise<User | undefined> {
    const user = (await this.getUserAndProfile().where('u.email', '=', email).executeTakeFirst()) as UserModel | undefined;

    if (!user) {
      return undefined;
    }

    const snapshot = this.userToSnapshot(user);

    return User.restoreFromSnapshot(snapshot);
  }

  public async save(user: User): Promise<void> {
    return this.handleUncommittedEvents(user);
  }

  private userToSnapshot(userModel: UserModel): UserSnapshot {
    return {
      email: userModel.email,
      id: userModel.id,
      profile: {
        id: userModel.profile.id,
        userId: userModel.profile.userId,
        firstName: userModel.profile.firstName,
        lastName: userModel.profile.lastName,
        username: userModel.profile.username,
        address: userModel.profile.address,
        gender: userModel.profile.gender,
        bio: userModel.profile.bio,
        dateOfBirth: userModel.profile.dateOfBirth,
        hobbies: userModel.profile?.hobbies ?? [],
        languages: userModel.profile?.languages ?? [],
        phoneNumber: userModel.profile.phoneNumber,
        profilePicture: userModel.profile.profilePicture,
        rodoAcceptanceDate: userModel.profile.rodoAcceptanceDate,
      },
      version: userModel.version,
    };
  }

  private getUserAndProfile() {
    return this.txHost.tx
      .selectFrom(`${TableNames.USERS} as u`)
      .select((eb) => [
        'u.id',
        'u.email',
        'u.version',
        'u.createdAt',
        'u.updatedAt',
        jsonObjectFrom(
          eb
            .selectFrom(`${TableNames.USER_PROFILES} as p`)
            .select([
              'p.id',
              'p.userId',
              'p.firstName',
              'p.lastName',
              'p.username',
              'p.bio',
              'p.address',
              'p.dateOfBirth',
              'p.gender',
              'p.hobbies',
              'p.languages',
              'p.phoneNumber',
              'p.profilePicture',
              'p.rodoAcceptanceDate',
              'p.createdAt',
              'p.updatedAt',
            ])
            .whereRef('p.userId', '=', 'u.id'),
        ).as('profile'),
      ]);
  }

  public async handleUserUpdatedEvent(event: UserCreatedEvent) {
    await this.db.tx
      .updateTable(TableNames.USERS)
      .set({
        email: event.email,
      })
      .where('id', '=', event.id.value)
      .executeTakeFirstOrThrow();

    await this.db.tx
      .updateTable(TableNames.USER_PROFILES)
      .set({
        firstName: event.profile.firstName,
        lastName: event.profile.lastName,
        username: event.profile.username,
        address: event.profile.address,
        bio: event.profile.bio,
        dateOfBirth: event.profile.dateOfBirth,
        gender: event.profile.gender,
        hobbies: event.profile.hobbies,
        languages: event.profile.languages,
        phoneNumber: event.profile.phoneNumber,
        profilePicture: event.profile.profilePicture,
        rodoAcceptanceDate: event.profile.rodoAcceptanceDate,
      })
      .where('id', '=', event.profile.id.value)
      .where('userId', '=', event.profile.userId.value)
      .execute();
  }

  public async handleUserCreatedEvent(event: UserCreatedEvent) {
    await this.db.tx
      .insertInto(TableNames.USERS)
      .values({ id: event.id.value, email: event.email } as UserModel)
      .execute();

    await this.db.tx
      .insertInto(TableNames.USER_PROFILES)
      .values({
        id: event.profile.id.value,
        userId: event.profile.userId.value,
      } as UserProfileModel)
      .execute();
  }
}
