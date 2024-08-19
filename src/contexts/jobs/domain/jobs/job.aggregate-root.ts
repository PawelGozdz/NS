import dayjs from 'dayjs';

import { Actor, Experience, SalaryRange } from '@app/core';
import { EntityId, getCoalescedField, getNullOrValueField } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';

import { JobCreatedEvent, JobUpdatedEvent } from './events';
import { JobSnapshot } from './job.snapshot';

const events = {
  JobCreatedEvent,
  JobUpdatedEvent,
};

export type JobEvents = typeof events;

export class Job extends AggregateRoot {
  id: EntityId;

  title: string | null;

  isActive: boolean;

  description: string | null;

  organizationId: EntityId | null;

  jobPositionId: EntityId;

  location: string | null;

  categoryIds: number[];

  salaryRange: SalaryRange | null;

  requiredSkills: Experience[];

  niceToHaveSkills: Experience[];

  requirements: string[];

  langiages: string[];

  benefits: string[];

  startDate: Date | null;

  endDate: Date | null;

  publicationDate: Date | null;

  expireDate: Date | null;

  contact: string | null;

  constructor(
    {
      id,
      title,
      isActive,
      description,
      organizationId,
      jobPositionId,
      location,
      categoryIds,
      salaryRange,
      requiredSkills,
      niceToHaveSkills,
      requirements,
      languages,
      benefits,
      startDate,
      endDate,
      publicationDate,
      expireDate,
      contact,
    }: {
      id: EntityId;
      title: string | null;
      isActive: boolean;
      description: string | null;
      organizationId: EntityId | null;
      jobPositionId: EntityId;
      location: string | null;
      categoryIds: number[];
      salaryRange: SalaryRange | null;
      requiredSkills: Experience[];
      niceToHaveSkills: Experience[];
      requirements: string[];
      languages: string[];
      benefits: string[];
      startDate: Date | null;
      endDate: Date | null;
      publicationDate: Date | null;
      expireDate: Date | null;
      contact: string | null;
    },
    version?: number,
  ) {
    super(version);

    this.id = id;
    this.title = title;
    this.isActive = isActive;
    this.description = description;
    this.organizationId = organizationId;
    this.jobPositionId = jobPositionId;
    this.location = location;
    this.categoryIds = categoryIds;
    this.salaryRange = salaryRange;
    this.requiredSkills = requiredSkills;
    this.niceToHaveSkills = niceToHaveSkills;
    this.requirements = requirements;
    this.langiages = languages;
    this.benefits = benefits;
    this.startDate = startDate;
    this.endDate = endDate;
    this.publicationDate = publicationDate;
    this.expireDate = expireDate;
    this.contact = contact;
  }

  public static create(
    {
      id,
      title,
      description,
      jobPositionId,
      organizationId,
      publicationDate,
      contact,
      endDate,
      expireDate,
      startDate,
      benefits,
      categoryIds,
      langiages,
      location,
      niceToHaveSkills,
      requiredSkills,
      requirements,
      salaryRange,
      actor,
    }: CreateJobData,
    version?: number,
  ): Job {
    const entity = new Job(
      {
        id: id ?? EntityId.createRandom(),
        isActive: false,
        title: title ?? null,
        description: description ?? null,
        organizationId: organizationId ?? null,
        jobPositionId,
        location: location ?? null,
        categoryIds: categoryIds ?? [],
        salaryRange: salaryRange ?? null,
        requiredSkills: requiredSkills ?? [],
        niceToHaveSkills: niceToHaveSkills ?? [],
        requirements: requirements ?? [],
        languages: langiages ?? [],
        benefits: benefits ?? [],
        startDate: startDate ?? null,
        endDate: endDate ?? null,
        publicationDate: publicationDate ?? null,
        expireDate: expireDate ?? null,
        contact: contact ?? null,
      },
      version,
    );

    entity.apply(
      new JobCreatedEvent({
        id: entity.id,
        title: entity.title,
        isActive: entity.isActive,
        description: entity.description,
        organizationId: entity.organizationId,
        jobPositionId: entity.jobPositionId,
        location: entity.location,
        categoryIds: entity.categoryIds,
        salaryRange: entity.salaryRange,
        requiredSkills: entity.requiredSkills,
        niceToHaveSkills: entity.niceToHaveSkills,
        requirements: entity.requirements,
        languages: entity.langiages,
        benefits: entity.benefits,
        startDate: entity.startDate,
        endDate: entity.endDate,
        publicationDate: entity.publicationDate,
        expireDate: entity.expireDate,
        contact: entity.contact,
        actor,
      }),
    );

    return entity;
  }

  update(entity: UpdateJobData) {
    const title = getNullOrValueField(entity.title, this.title);
    const isActive = getCoalescedField(entity.isActive, this.isActive) as boolean;
    const description = getNullOrValueField(entity.description, this.description);
    const jobPositionId = getCoalescedField(entity.jobPositionId, this.jobPositionId) as EntityId;
    const location = getNullOrValueField(entity.location, this.location);
    const categoryIds = getCoalescedField(entity.categoryIds, this.categoryIds) as number[];
    const salaryRange = getNullOrValueField(entity.salaryRange, this.salaryRange);
    const requiredSkills = getCoalescedField(entity.requiredSkills, this.requiredSkills) as Experience[];
    const niceToHaveSkills = getCoalescedField(entity.niceToHaveSkills, this.niceToHaveSkills) as Experience[];
    const requirements = getCoalescedField(entity.requirements, this.requirements) as string[];
    const languages = getCoalescedField(entity.langiages, this.langiages) as string[];
    const benefits = getCoalescedField(entity.benefits, this.benefits) as string[];
    const startDate = getNullOrValueField(entity.startDate, this.startDate);
    const endDate = getNullOrValueField(entity.endDate, this.endDate);
    const publicationDate = getNullOrValueField(entity.publicationDate, this.publicationDate);
    const expireDate = getNullOrValueField(entity.expireDate, this.expireDate);
    const contact = getNullOrValueField(entity.contact, this.contact);

    this.apply(
      new JobUpdatedEvent({
        id: this.id,
        organizationId: this.organizationId,
        title,
        isActive,
        description,
        jobPositionId,
        location,
        categoryIds,
        salaryRange,
        requiredSkills,
        niceToHaveSkills,
        requirements,
        languages,
        benefits,
        startDate,
        endDate,
        publicationDate,
        expireDate,
        contact,
        actor: entity.actor,
      }),
    );
  }

  public static restoreFromSnapshot(dao: JobSnapshot): Job {
    const rentalPeriod = new Job(
      {
        id: new EntityId(dao.id),
        title: dao.title,
        isActive: dao.isActive,
        description: dao.description,
        organizationId: dao.organizationId ? new EntityId(dao.organizationId) : null,
        jobPositionId: new EntityId(dao.jobPositionId),
        location: dao.location,
        categoryIds: dao.categoryIds,
        salaryRange: new SalaryRange(dao.salaryRange.from, dao.salaryRange.to),
        requiredSkills: dao.requiredSkills.map((exp) => new Experience(exp.skillId, exp.startDate, exp.endDate, exp.experienceInMonths)),
        niceToHaveSkills: dao.niceToHaveSkills.map((exp) => new Experience(exp.skillId, exp.startDate, exp.endDate, exp.experienceInMonths)),
        requirements: dao.requirements,
        languages: dao.languages,
        benefits: dao.benefits,
        startDate: dao.startDate ? dayjs(dao.startDate).toDate() : null,
        endDate: dao.endDate ? dayjs(dao.endDate).toDate() : null,
        publicationDate: dao.publicationDate ? dayjs(dao.publicationDate).toDate() : null,
        expireDate: dao.expireDate ? dayjs(dao.expireDate).toDate() : null,
        contact: dao.contact,
      },
      dao.version,
    );

    return rentalPeriod;
  }

  private onJobUpdatedEvent(event: JobUpdatedEvent) {
    this.salaryRange = event.salaryRange;
    this.title = event.title;
    this.description = event.description;
    this.jobPositionId = event.jobPositionId;
    this.location = event.location;
    this.categoryIds = event.categoryIds;
    this.requiredSkills = event.requiredSkills;
    this.niceToHaveSkills = event.niceToHaveSkills;
    this.requirements = event.requirements;
    this.langiages = event.languages;
    this.benefits = event.benefits;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.publicationDate = event.publicationDate;
    this.expireDate = event.expireDate;
    this.contact = event.contact;
  }

  getId(): string {
    return this.id.value;
  }

  getTitle(): string | null {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  getSalaryRange() {
    return this.salaryRange;
  }

  getCategoryIds() {
    return this.categoryIds;
  }

  getRequiredSkills() {
    return this.requiredSkills;
  }

  getNiceToHaveSkills() {
    return this.niceToHaveSkills;
  }

  getRequirements() {
    return this.requirements;
  }

  getLanguages() {
    return this.langiages;
  }

  getBenefits() {
    return this.benefits;
  }

  getStartDate() {
    return this.startDate;
  }

  getEndDate() {
    return this.endDate;
  }

  getPublicationDate() {
    return this.publicationDate;
  }

  getExpireDate() {
    return this.expireDate;
  }

  getContact() {
    return this.contact;
  }

  getLocation() {
    return this.location;
  }

  getOrganizationId() {
    return this.organizationId?.value;
  }

  getJobPositionId() {
    return this.jobPositionId.value;
  }
}

type CreateJobData = {
  id?: EntityId;
  title?: string;
  description?: string;
  organizationId?: EntityId;
  jobPositionId: EntityId;
  location?: string;
  categoryIds?: number[];
  salaryRange?: SalaryRange;
  requiredSkills?: Experience[];
  niceToHaveSkills?: Experience[];
  requirements?: string[];
  langiages?: string[];
  benefits?: string[];
  startDate?: Date;
  endDate?: Date;
  publicationDate?: Date;
  expireDate?: Date;
  contact?: string;
  actor: Actor;
};

type UpdateJobData = {
  id?: EntityId;
  title: string | null;
  isActive?: boolean;
  description?: string | null;
  jobPositionId?: EntityId;
  location?: string;
  categoryIds?: number[];
  salaryRange?: SalaryRange;
  requiredSkills?: Experience[];
  niceToHaveSkills?: Experience[];
  requirements?: string[];
  langiages?: string[];
  benefits?: string[];
  startDate?: Date | null;
  endDate?: Date | null;
  publicationDate?: Date | null;
  expireDate?: Date | null;
  contact?: string | null;
  actor: Actor;
};
