# 13. Error creation method

Date: 2024-02-15

## Status

2024-02-15 accepted

## Context

There are two ways of creating errors in the codebase - via **constructor** (e.g. `new UserNotFoundError(userId)`) and via **static helper methods** (e.g. `UserNotFoundError.withId(userId)`). It creates inconsistencies how code looks and developers are not sure how to create errors "correctly".

## Decision

After discussions on forums with other developers, we settled that there are no significant advantages and disadvantages between the **constructor approach** and the **static helper method approach**.

One advantage of the **static helper method approach** is that we can create custom errors of the same type (e.g. `UserNotFoundError.withId(userId)`, `UserNotFoundError.withEmail(email)`, `UserNotFoundError.withPhoneNumber(phoneNumber)`) without having to create multiple files we customized class names to handle all the cases.

Due to ease of error creation, we have decided to use the **static helper method approach**.

## Consequences

- We will have one method for creating errors in the code which will reduce inconsistencies and speed up development a bit.
