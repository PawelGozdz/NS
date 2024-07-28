export type JobPositionSnapshot = {
  id: string;

  title: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;
};
