# 2. Logging system

Date: 2024-02-11

## Status

2024-02-11 accepted

## Context

Each application creates logs. These logs must be clear and contain the most important information that will be helpful in debugging problems later. The application should not handle saving logs to avoid performance issues with NodeJS being single-threaded. It should also output logs to the standard output in the JSON format to follow the twelve-factor app principles and allow for parsing and querying them in external services like Kibana. However, when developers are working on it, the application must also output logs in human-readable format instead of a JSON format. We have considered several libraries for NodeJS like Winston, Pino, etc.
It's also easy to implement custom dislay and redact secrets (passwords, emails, etc).

## Decision

We chose [Pino](https://github.com/iamolegga/nestjs-pino) as the NestJS library because it complies with [this principle](https://12factor.net/logs) and meets our expectations. We have already used it in other projects and we are satisfied with it. It works fast, the information logged by it is very exact.

## Consequences

- The logging method will change slightly, a logger from a different library will be used, but very similar api to NestJS logger
- Logs from the entire application should be logged through it
- Production logs will be sent to standard output in a JSON format
