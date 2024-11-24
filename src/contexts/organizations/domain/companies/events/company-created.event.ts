import { Actor, Address, PhoneNumber } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class CompanyCreatedEvent extends Event<CompanyCreatedEvent> {
  id: EntityId;

  name: string;

  address: Address | null;

  contactEmail: string | null;

  contactPhone: PhoneNumber | null;

  actor: Actor;

  constructor(event: CompanyCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
