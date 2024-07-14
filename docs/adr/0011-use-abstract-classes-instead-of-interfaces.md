# 11. Use abstract classes instead of interfaces

Date: 2024-02-15

## Status

2024-02-15 accepted

## Context

When we create interfaces for class dependencies and then use those interfaces instead of concrete classes, NestJS dependency injection requires us to create a token that is used for dependency injection purposes, and then use an `@Inject` decorator when trying to use those interfaces. This is required because Typescript interfaces and types do not exist in the runtime. However, it is possible to avoid using decorator if we use classes or abstract classes instead of types.

## Decision

We will use abstract classes in place of interfaces and types for objects that are injected via NestJS dependency injection mechanism.

## Consequences

- We will noticeably reduce the number of decorators in the project, which will improve code readability.
- Using abstract classes for this purpose is not idiomatic, so it will be a bit non-obvious for new people joining the project.
