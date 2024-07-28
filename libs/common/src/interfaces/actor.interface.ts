import { ActorType } from '../enums';

export interface IActor {
  type: ActorType;
  source: string;
  id?: string;
}
