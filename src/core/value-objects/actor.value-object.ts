import { isAlphanumeric, isEnum, isUUID } from 'class-validator';

import { ActorType, AppUtils, IActor, MissingValueError } from '@libs/common';

import { ActorError } from '../errors';

export class Actor implements IActor {
  constructor(
    public readonly type: ActorType,
    public readonly source: string,
    public readonly id?: string,
  ) {}

  public static create(type: ActorType, source: string, id?: string): Actor {
    if (AppUtils.isEmpty(type)) {
      throw new MissingValueError('Actor.type');
    }

    if (!isEnum(type, ActorType)) {
      throw ActorError.withType(type);
    }

    if (!source) {
      throw new MissingValueError('Actor.source');
    }

    if (!isAlphanumeric(source)) {
      throw ActorError.withMessage('Actor.source must contain only alphanumeric characters');
    }

    if (type === ActorType.SYSTEM) {
      if (id) {
        throw ActorError.withMessage('Actor.id is not allowed for SYSTEM actor');
      }
    } else {
      if (!id) {
        throw new MissingValueError('Actor.id');
      }

      if (!isUUID(id)) {
        throw ActorError.withMessage(`Invalid UUID: ${id}`);
      }
    }

    return new Actor(type, source, id);
  }
}
