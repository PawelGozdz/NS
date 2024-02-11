# 2. Changefiles

Date: 2024-02-11

## Status

2024-02-11 accepted

## Context

As the project grows and several developers start working together, it's easy to lose track of what has been committed and what has not. Changefiles will contain versioning that goes from the DEV instance to the QA instance. Having a list of ticket numbers will make deployment much easier and will prevent missing key functionality that might be a dependency for another.

## Decision

We will use format for adding ticket versions like so:

[0.0.1]

- (HI-55) Ticket description

## Consequences

It will help to manage of what is going to the release stage without fear of missing functionalities.
