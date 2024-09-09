import { ActorType } from '../enums';

export interface IActorBase {
  id?: string;
  type: ActorType;
}

export interface IActor extends IActorBase {
  source: string;
}
