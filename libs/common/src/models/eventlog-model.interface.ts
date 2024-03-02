export abstract class IEventLogModel {
  id: number;

  data: Record<string, unknown>;

  eventName: string;

  createdAt: Date;
}
