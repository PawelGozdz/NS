// eslint-disable-next-line no-restricted-imports
import { Command as CommandBase } from '@nestjs-architects/typed-cqrs';

export abstract class Command<TCommand, TResponse> extends CommandBase<TResponse> {
  constructor(command: Omit<TCommand, keyof CommandBase<TResponse>>) {
    super();

    Object.assign(this, command);
  }
}
