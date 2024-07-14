import { IOutboxModel } from '@app/core';
import { Event } from '@libs/cqrs';

export class Outbox<T = unknown> {
  public id: number;

  public eventName: string;

  public context: string;

  public data: Event<T>;

  public createdAt: Date;

  public publishedOn: Date | null;

  constructor(props: { id: number; eventName: string; context: string; data: Event<T>; createdAt: Date; publishedOn: Date | null }) {
    this.id = props.id;
    this.eventName = props.eventName;
    this.context = props.context;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.publishedOn = props.publishedOn;
  }

  static create<T>(props: { id: number; eventName: string; context: string; data: Event<T>; createdAt: Date; publishedOn: Date | null }): Outbox<T> {
    return new Outbox(props);
  }
}

export class OutboxModel implements IOutboxModel {
  public id: number;

  public eventName: string;

  public context: string;

  public data: Event<unknown>;

  public createdAt: Date;

  public publishedOn: Date | null;

  constructor(props: { id: number; eventName: string; context: string; data: Event<unknown>; createdAt: Date; publishedOn: Date | null }) {
    this.id = props.id;
    this.eventName = props.eventName;
    this.context = props.context;
    this.data = props.data;
    this.createdAt = props.createdAt;
    this.publishedOn = props.publishedOn;
  }
}
