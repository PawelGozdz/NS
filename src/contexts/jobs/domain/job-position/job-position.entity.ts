import { EntityId, generateSlug } from '@libs/common';

import { JobPositionSnapshot } from './job-position.snapshot';

export class JobPosition {
  id: EntityId;

  title: string;

  slug: string;

  categoryId: number;

  skillIds: number[];

  constructor(props: { id: EntityId; title: string; slug: string; skillIds: number[]; categoryId: number }) {
    this.id = props.id;
    this.title = props.title;
    this.slug = props.slug;
    this.skillIds = props.skillIds ?? [];
    this.categoryId = props.categoryId;
  }

  public static create({ id, title, skillIds, categoryId, slug }: IJobPositionCreateData): JobPosition {
    const entity = new JobPosition({
      id: id ?? EntityId.createRandom(),
      title,
      slug: slug ?? generateSlug(title),
      skillIds,
      categoryId,
    });

    return entity;
  }

  public static restoreFromSnapshot(snapshot: JobPositionSnapshot): JobPosition {
    return new JobPosition({
      id: new EntityId(snapshot.id),
      title: snapshot.title,
      slug: snapshot.slug,
      skillIds: snapshot.skillIds,
      categoryId: snapshot.categoryId,
    });
  }

  public addSkill(skillId: number): void {
    this.skillIds.push(skillId);
  }

  public removeSkill(skillId: number): void {
    this.skillIds = this.skillIds.filter((id) => id !== skillId);
  }
}

export type IJobPositionCreateData = {
  id?: EntityId;
  title: string;
  slug?: string;
  categoryId: number;
  skillIds: number[];
};

export type IJobPositionUpdateData = {
  id: EntityId;
  title?: string;
  slug?: string;
  categoryId?: number;
  skillIds?: number[];
};
