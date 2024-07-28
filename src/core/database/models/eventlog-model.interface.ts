import { IActor } from '@libs/common';

export abstract class IEventLogModel {
  id: number;

  data: Record<string, unknown>;

  actor: IActor;

  eventName: string;

  createdAt: Date;
}
