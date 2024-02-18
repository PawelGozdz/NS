# 3. Propagating domain events to the eventlog table

Date: 2024-02-18

## Status

2024-02-18 accepted

## Context

In certain parts of the application, we produce and consume domain events. One such place is through the AggregateRoot, which, under the hood, stores them whenever any entity events are stored. The other place is where we don't have DDD implemented, and domain events are published through the outbox pattern.

## Decision

The AggregateRoot will remain as it is. Events that are published through the Outbox will be stored in a transaction along with the insertion into the Outbox table.

## Consequences

This will help keep the eventlog table updated whenever a new event is published, regardless of its source.
