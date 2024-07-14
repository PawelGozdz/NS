# 3. Git hooks for linter auto fix

Date: 2024-03-02

## Status

2024-03-02 accepted

## Context

We use ESLint and Prettier tools to ensure code quality and formatting consistency. Those checks are ran as a part of the CI pipeline for all merge requests. If an error is found, a developer must go back and fix the error or run a Prettier to correct the formatting of the file.

If a developer uses an IDE with a proper configuration, a development cycle is much shorter - formatting can be applied on every save and common ESLint rule errors can be fixed automatically. However, a developer may use an editor that does not have a good integration with a linter or may forget to run a format command if he chooses not to use a "format on save" feature.

Since a lot of linter errors can be fixed automatically and formatting is fixed via command anyway, it can easily be automated via git hooks to shorten the development cycle.

## Decision

We will use git hooks to run eslint auto-fix feature before a commit is made.

## Consequences

- All commits will have valid typescript files with a proper formatting.
- A development cycle for linter errors will be shortened.
- Developers will have to remember to use --no-verify command in an uncommon scenario, when they want to temporarily commit invalid files.
