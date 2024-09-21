export type JobPositionSnapshot = {
  id: string;

  title: string;

  slug: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;
};
