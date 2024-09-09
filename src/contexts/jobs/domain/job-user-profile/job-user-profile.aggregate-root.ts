import dayjs from 'dayjs';

import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId, getCoalescedField, getNullOrValueField } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';

import { JobUserProfileCreatedEvent, JobUserProfileUpdatedEvent } from './events';
import { JobUserProfileSnapshot } from './job-user-profile.snapshot';

const events = {
  JobUserProfileCreatedEvent,
  JobUserProfileUpdatedEvent,
};

export type JobUserProfileEvents = typeof events;

// TODO: experience bez endDate możliwe jest jedynie, gdy user ma daną sprawność w aktualnej pracy
// W przeciwnym wypadku endDate jest wymagane

export class JobUserProfile extends AggregateRoot {
  id: EntityId;

  bio: string | null;

  userId: EntityId;

  salaryRange: SalaryRange;

  jobIds: EntityId[];

  jobPositionIds: EntityId[];

  experience: Experience[];

  education: Education[];

  certificates: Certification[];

  createdAt: Date;

  updatedAt: Date;

  constructor(
    {
      id,
      bio,
      userId,
      salaryRange,
      jobIds,
      jobPositionIds,
      experience,
      education,
      certificates,
    }: {
      id: EntityId;
      userId: EntityId;
      bio?: string | null;
      salaryRange: SalaryRange;
      jobIds?: EntityId[];
      jobPositionIds?: EntityId[];
      experience?: Experience[];
      education?: Education[];
      certificates?: Certification[];
      createdAt?: Date;
      updatedAt?: Date;
    },
    version?: number,
  ) {
    super(version);

    this.id = id;
    this.bio = bio ?? null;
    this.userId = userId;
    this.salaryRange = salaryRange;
    this.jobIds = jobIds ?? [];
    this.jobPositionIds = jobPositionIds ?? [];
    this.experience = experience ?? [];
    this.education = education ?? [];
    this.certificates = certificates ?? [];
  }

  public static create(
    { id, bio, userId, salaryRange, jobIds, jobPositionIds, experience, education, certificates, actor }: CreateJobUserProfileData,
    version?: number,
  ): JobUserProfile {
    const entity = new JobUserProfile(
      {
        id: id ?? EntityId.createRandom(),
        bio,
        userId,
        salaryRange,
        jobIds,
        jobPositionIds,
        experience,
        education,
        certificates,
      },
      version,
    );

    console.log('ENTITY', entity);

    entity.apply(
      new JobUserProfileCreatedEvent({
        id: entity.id,
        bio: entity.bio,
        userId: entity.userId,
        salaryRange: entity.salaryRange,
        jobIds: entity.jobIds,
        jobPositionIds: entity.jobPositionIds,
        experience: entity.experience,
        education: entity.education,
        certificates: entity.certificates,
        actor,
      }),
    );

    return entity;
  }

  update(entity: UpdateJobUserProfileData) {
    const potentialNewBio = getNullOrValueField(entity.bio, this.bio);
    const potentialSalaryRange = getCoalescedField(entity.salaryRange, this.salaryRange) as SalaryRange;
    const potentialjobIds = getCoalescedField(entity.jobIds, this.jobIds) as EntityId[];
    const potentialjobPositionIds = getCoalescedField(entity.jobPositionIds, this.jobPositionIds) as EntityId[];
    const potentialExperience = getCoalescedField(entity.experience, this.experience) as Experience[];
    const potentialEducation = getCoalescedField(entity.education, this.education) as Education[];
    const potentialCertificates = getCoalescedField(entity.certificates, this.certificates) as Certification[];

    this.apply(
      new JobUserProfileUpdatedEvent({
        id: this.id,
        userId: this.userId,
        bio: potentialNewBio,
        salaryRange: potentialSalaryRange,
        jobIds: potentialjobIds,
        jobPositionIds: potentialjobPositionIds,
        experience: potentialExperience,
        education: potentialEducation,
        certificates: potentialCertificates,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        actor: entity.actor,
      }),
    );
  }

  public static restoreFromSnapshot(dao: JobUserProfileSnapshot): JobUserProfile {
    const rentalPeriod = new JobUserProfile(
      {
        id: new EntityId(dao.id),
        bio: dao.bio ?? null,
        userId: new EntityId(dao.userId),
        salaryRange: new SalaryRange(dao.salaryRange.from, dao.salaryRange.to),
        jobIds: dao.jobIds.map((job) => new EntityId(job)),
        jobPositionIds: dao.jobPositionIds.map((jobPosition) => new EntityId(jobPosition)),
        experience: dao.experience.map((exp) => new Experience(exp.skillId, exp.startDate, exp.endDate, exp.experienceInMonths)),
        education: dao.education.map((edu) => new Education(edu.degree, edu.institution, edu.graduateYear)),
        certificates: dao.certificates.map((cert) => new Certification(cert.name, cert.institution, cert.completionYear)),
        createdAt: dayjs(dao.createdAt).toDate(),
        updatedAt: dayjs(dao.updatedAt).toDate(),
      },
      dao.version,
    );

    return rentalPeriod;
  }

  private onJobUserProfileUpdatedEvent(event: JobUserProfileUpdatedEvent) {
    this.bio = event.bio;
    this.salaryRange = event.salaryRange;
    this.jobIds = event.jobIds;
    this.jobPositionIds = event.jobPositionIds;
    this.experience = event.experience;
    this.education = event.education;
    this.certificates = event.certificates;
    this.jobPositionIds = event.jobPositionIds;
    this.jobIds = event.jobIds;
    this.education = event.education;
    this.certificates = event.certificates;
  }

  getId(): string {
    return this.id.value;
  }

  getBio(): string | null {
    return this.bio;
  }

  getUserId(): string {
    return this.userId.value;
  }

  getSalaryRange(): SalaryRange {
    return this.salaryRange;
  }

  getjobIds(): string[] {
    return this.jobIds.map((job) => job.value);
  }

  getjobPositionIds(): string[] {
    return this.jobPositionIds.map((jobPosition) => jobPosition.value);
  }

  getExperience(): Experience[] {
    return this.experience;
  }

  getEducation(): Education[] {
    return this.education;
  }

  getCertificates(): Certification[] {
    return this.certificates;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}

type CreateJobUserProfileData = {
  id?: EntityId;
  userId: EntityId;
  bio?: string | null;
  salaryRange: SalaryRange;
  jobIds?: EntityId[];
  jobPositionIds?: EntityId[];
  experience?: Experience[];
  education?: Education[];
  certificates?: Certification[];
  actor: Actor;
};

type UpdateJobUserProfileData = {
  userId?: EntityId;
  bio?: string | null;
  salaryRange?: SalaryRange;
  jobIds?: EntityId[];
  jobPositionIds?: EntityId[];
  experience?: Experience[];
  education?: Education[];
  certificates?: Certification[];
  actor: Actor;
};
