# 8. Propagating Domain Events to the Eventlog Table

Date: 2024-02-11

## Status

2024-02-11 accepted

## Context

Our application generates and handles domain events in two primary scenarios:
1. Modification of AggregateRoots, where events are automatically stored in eventlog table
2. Usage of the Outbox pattern for cases not involving AggregateRoots, where events are manually published.

## Decision

We have decided to maintain the current handling of events within AggregateRoots. Additionally, for events published via the Outbox pattern, we will ensure these are also stored in the eventlog table. This storage will occur within the same moment that inserts the event into the Outbox table.

## Consequences

- By adopting this approach, we ensure the eventlog table is consistently updated with all domain events, regardless of their origin. This dual-path storage mechanism enhances our application's ability to track and respond to domain events across different contexts.
- Additional mechanism (CRON) is needed to publish domain events accross the system.
