import { Actor, Address, PhoneNumber } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class CompanyUpdatedEvent extends Event<CompanyUpdatedEvent> {
  id: EntityId;

  name: string;

  address: Address | null;

  contactEmail: string | null;

  contactPhone: PhoneNumber | null;

  actor: Actor;

  constructor(event: CompanyUpdatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
