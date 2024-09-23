export abstract class IJobPositionModel {
  id: string;

  title: string;

  slug: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;
}
