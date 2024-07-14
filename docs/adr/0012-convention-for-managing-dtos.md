# 12. Convention for managing dtos

Date: 2024-02-15

## Status

2024-02-15 accepted

## Context

We do not have uniform way to manage DTO classes in the project. It is not clear whether we should use field prefixes (e.g. `public`, `readonly`) and what suffix to add depending on whether the DTO will be used to validate request body, query or params. This makes DTO written by different developers look different and sometimes we can run into a problem with TypeScript and the `readonly` keyword.

## Decision

We made a decision that we want to make the naming and behavior of decorators more consistent by introducing an appropriate convention.

The naming convention we want to go with is the following:

- Suffix `*BodyDto` (e.g. `CreateUserBodyDto`) indicates HTTP request body.
- Suffix `*ParamsDto` (e.g. `CreateUserParamsDto`) - Indicates HTTP request path parameters.
- Suffix `*QueryDto` (e.g. `CreateUserQueryDto`) indicates HTTP request query parameters.
- Suffix `*HeadersDto` (e.g. `CreateUserHeadersDto`) indicates HTTP request headers.
- Suffix `*ResponseDto` (e.g. `CreateUserResponseDto`) indicates HTTP response body.

We also decided that we don't want to use `public` and `readonly` modifiers for fields in DTO classes because they do not bring much value and sometimes even can cause troubles.

## Consequences

- The DTO validation layer will be more consistent in terms of nomenclature.
- We will avoid potential problems with the `readonly` keyword in TypeScript.

