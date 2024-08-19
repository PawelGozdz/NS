import { EntityId } from '@libs/common';

import { JobPositionSnapshot } from './job-position.snapshot';

export class JobPosition {
  id: EntityId;

  title: string;

  categoryId: number;

  skillIds: number[];

  constructor(props: { id: EntityId; title: string; skillIds: number[]; categoryId: number }) {
    this.id = props.id;
    this.title = props.title;
    this.skillIds = props.skillIds ?? [];
    this.categoryId = props.categoryId;
  }

  public static create({ id, title, skillIds, categoryId }: IJobPositionCreateData): JobPosition {
    const entity = new JobPosition({
      id: id ?? EntityId.createRandom(),
      title,
      skillIds,
      categoryId,
    });

    return entity;
  }

  public static restoreFromSnapshot(snapshot: JobPositionSnapshot): JobPosition {
    return new JobPosition({
      id: new EntityId(snapshot.id),
      title: snapshot.title,
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
  categoryId: number;
  skillIds: number[];
};

export type IJobPositionUpdateData = {
  id: EntityId;
  title?: string;
  categoryId?: number;
  skillIds?: number[];
};
