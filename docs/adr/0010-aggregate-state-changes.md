# 10. Aggregate state changes

Date: 2024-02-15

## Status

2024-02-15 accepted

## Context

We're using an event-based approach in our aggregates to notify the external world about changes [inside aggregates](0005-aggregate-saving-convention.md). This allows us to introduce Event Sourcing in the future if we wish to do so. However, to do that, aggregate methods must never modify an aggregate state directly, as this would make it impossible to restore an aggregate from the event stream.

## Decision

Aggregate methods should check all business invariants to ensure that the given operation is allowed. If these checks are passed, it must emit one or more events that contain all information used for aggregate state changes and persistence in a repository layer.

An aggregate state should only be changed in `onEventName` methods that are fired automatically when an event is applied. This ensures that we'll be able to restore any aggregate from an event stream instead of a snapshot if desired.

An event that is emitted represents a business fact about something important happening in the past. Event handler methods in an aggregate must not perform any additional validation of the event data, essentially treating it the same way as if it was persisted in the database already.

## Consequences

- Code that updates an aggregate will be separated from the code that validates business rules.
- Unit tests can now initialize an aggregate using an event list instead of a snapshot.
- We will be able to use Event Sourcing without refactoring the domain layer.
