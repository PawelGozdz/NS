/* eslint-disable no-restricted-syntax */
import { Kysely, Transaction } from 'kysely';

import { JobModel, JobPositionModel, JobUserProfileModel, UserProfileModel } from '@app/contexts';
import { IDatabaseModels, TableNames, dialect, kyselyPlugins } from '@app/core';

import { JobFixtureFactory, JobPositionFixtureFactory, JobUserProfileFixtureFactory } from '../fixtures/job.fixture';

type IDatabaseDaos = IDatabaseModels;

export class JobSeedBuilder {
  public dbConnection: Kysely<IDatabaseDaos>;

  public jobDao: JobModel;

  public jobUserProfileDao: JobUserProfileModel;

  public jobPositionDao: JobPositionModel;

  daos: {
    jobDaoObj: JobModel | undefined;
    jobUserProfileDaoObj: JobUserProfileModel | undefined;
    jobPositionDaoObj: JobPositionModel | undefined;
  } = { jobDaoObj: undefined, jobUserProfileDaoObj: undefined, jobPositionDaoObj: undefined };

  actions: { method: string }[] = [];

  cookies: string[] = [];

  private constructor(dbConnection: Kysely<IDatabaseDaos>) {
    this.dbConnection = dbConnection;
  }

  async build() {
    for await (const action of this.actions) {
      await this[action.method]();
    }

    return this;
  }

  static async create(db?: Transaction<IDatabaseDaos>): Promise<JobSeedBuilder> {
    const builder = new JobSeedBuilder(
      db ??
        new Kysely<IDatabaseDaos>({
          dialect,
          plugins: kyselyPlugins,
        }),
    );

    return builder;
  }

  private async insertJob() {
    if (!this.daos.jobDaoObj) {
      throw new Error('JobDao is not defined');
    }

    if (!this.daos.jobPositionDaoObj) {
      throw new Error('JobPositionDao is not defined to insert Job');
    }

    this.jobDao = (await this.dbConnection
      .insertInto(TableNames.JOBS)
      .values({
        ...this.daos.jobDaoObj,
        jobPositionId: this.daos.jobPositionDaoObj.id,
      })
      .returningAll()
      .executeTakeFirst()) as JobModel;
  }

  withJob(dao?: Partial<JobModel>): this {
    this.daos.jobDaoObj = JobFixtureFactory.create({
      ...dao,
    });

    this.actions.push({ method: 'insertJob' });

    return this;
  }

  private async insertJobUserProfile(): Promise<this> {
    if (!this.daos.jobUserProfileDaoObj) {
      throw new Error('JobUserProfile is not defined');
    }

    this.jobUserProfileDao = (await this.dbConnection
      .insertInto(TableNames.JOB_USER_PROFILES)
      .values(this.daos.jobUserProfileDaoObj)
      .returningAll()
      .executeTakeFirst()) as JobUserProfileModel;

    return this;
  }

  withJobUserProfile(entity: Partial<JobUserProfileModel> & { userId: string }): this {
    if (!this.daos.jobUserProfileDaoObj) {
      throw new Error('JobUserProfileDaoObj is not defined');
    }

    this.daos.jobUserProfileDaoObj = JobUserProfileFixtureFactory.create({
      ...entity,
      userId: entity.userId,
    });

    this.actions.push({ method: 'insertJobUserProfile' });

    return this;
  }

  private async insertJobPosition() {
    if (!this.daos.jobPositionDaoObj) {
      throw new Error('JobPositionDao is not defined');
    }

    this.jobPositionDao = (await this.dbConnection
      .insertInto(TableNames.JOB_POSITIONS)
      .values(this.daos.jobPositionDaoObj)
      .returningAll()
      .executeTakeFirst()) as JobPositionModel;
  }

  withJobPosition(profile: Partial<UserProfileModel> & { categoryId: number }): this {
    this.daos.jobPositionDaoObj = JobPositionFixtureFactory.create({
      ...profile,
      categoryId: profile.categoryId,
    });

    this.actions.push({ method: 'insertJobPosition' });

    return this;
  }
}
