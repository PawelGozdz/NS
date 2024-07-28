export abstract class IJobPositionModel {
  id: string;

  title: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;
}
