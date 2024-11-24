import { Actor, Address, PhoneNumber } from '@app/core';
import { dayjs, EntityId, getCoalescedField, getNullOrValueField } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';

import { CompanySnapshot } from './company.shapshot';
import { CompanyCreatedEvent, CompanyUpdatedEvent } from './events';

const events = {
  CompanyCreatedEvent,
  CompanyUpdatedEvent,
};

export type CompanyEvents = typeof events;

export class Company extends AggregateRoot {
  id: EntityId;

  name: string;

  address: Address | null;

  contactEmail: string | null;

  contactPhone: PhoneNumber | null;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    {
      id,
      name,
      address,
      contactEmail,
      contactPhone,
    }: {
      id: EntityId;
      name: string;
      address?: Address | null;
      contactEmail?: string | null;
      contactPhone?: PhoneNumber | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    version?: number,
  ) {
    super(version);
    this.id = id;
    this.name = name;
    this.address = address ?? null;
    this.contactEmail = contactEmail ?? null;
    this.contactPhone = contactPhone ?? null;
  }

  public static create(
    {
      id,
      name,
      address,
      contactEmail,
      contactPhone,
      actor,
    }: {
      id?: EntityId;
      name: string;
      address?: Address | null;
      contactEmail?: string | null;
      contactPhone?: PhoneNumber | null;
      actor: Actor;
    },
    version?: number,
  ): Company {
    const entity = new Company(
      {
        id: id ?? EntityId.createRandom(),
        name,
        address,
        contactEmail,
        contactPhone,
      },
      version,
    );

    entity.apply(
      new CompanyCreatedEvent({
        id: entity.id,
        name: entity.name,
        address: entity.address,
        contactEmail: entity.contactEmail,
        contactPhone: entity.contactPhone,
        actor,
      }),
    );

    return entity;
  }

  update({
    name,
    address,
    contactEmail,
    contactPhone,
    actor,
  }: {
    name?: string;
    address?: Address | null;
    contactEmail?: string | null;
    contactPhone?: PhoneNumber | null;
    actor: Actor;
  }) {
    const updatedName = getCoalescedField(name, this.name) as string;
    const updatedAddress = getNullOrValueField(address, this.address);
    const updatedContactEmail = getNullOrValueField(contactEmail, this.contactEmail);
    const updatedContactPhone = getNullOrValueField(contactPhone, this.contactPhone);

    this.apply(
      new CompanyUpdatedEvent({
        id: this.id,
        name: updatedName,
        address: updatedAddress,
        contactEmail: updatedContactEmail,
        contactPhone: updatedContactPhone,
        actor,
      }),
    );

    this.name = updatedName;
    this.address = updatedAddress;
    this.contactEmail = updatedContactEmail;
    this.contactPhone = updatedContactPhone;
    this.updatedAt = new Date();
  }

  public static restoreFromSnapshot(snapshot: CompanySnapshot): Company {
    return new Company(
      {
        id: new EntityId(snapshot.id),
        name: snapshot.name,
        address: snapshot.address
          ? new Address({
              street: snapshot.address.street,
              streetNumber: snapshot.address.streetNumber,
              city: snapshot.address.city,
              countryCode: snapshot.address.countryCode,
              postalCode: snapshot.address.postalCode,
            })
          : null,
        contactEmail: snapshot.contactEmail,
        contactPhone: snapshot.contactPhone
          ? new PhoneNumber({
              number: snapshot.contactPhone.number,
              countryCode: snapshot.contactPhone.countryCode,
            })
          : null,
        createdAt: dayjs(snapshot.createdAt).toDate(),
        updatedAt: dayjs(snapshot.updatedAt).toDate(),
      },
      snapshot.version,
    );
  }

  private onCompanyUpdateEvent(event: CompanyUpdatedEvent) {
    this.name = event.name;
    this.address = event.address;
    this.contactEmail = event.contactEmail;
    this.contactPhone = event.contactPhone;
  }

  getId() {
    return this.id.value;
  }

  getName() {
    return this.name;
  }

  getAddress() {
    return this.address;
  }

  getContactEmail() {
    return this.contactEmail;
  }

  getContactPhone() {
    return this.contactPhone;
  }
}
