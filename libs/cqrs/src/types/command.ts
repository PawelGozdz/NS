/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICommand } from '@nestjs/cqrs';

import { IActor } from '@libs/common';

export class CommandBase<T> implements ICommand {}

export declare type CommandResult<CommandT extends CommandBase<unknown>> = CommandT extends CommandBase<infer ResultT> ? ResultT : never;

export abstract class Command<TCommand extends CommandBase<TResponse>, TResponse> extends CommandBase<TResponse> {
  abstract actor: IActor;

  constructor(command: Omit<TCommand, keyof CommandBase<TResponse>>) {
    super();

    Object.assign(this, command);
  }
}
