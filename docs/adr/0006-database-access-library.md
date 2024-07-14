# 6. Database access library

Date: 2024-02-11

## Status

2024-02-11 accepted

## Context

Given the project's commitment to Domain-Driven Design (DDD) and the Command Query Responsibility Segregation (CQRS) pattern, the choice of database access library is crucial. DDD emphasizes domain logic, often leading to simpler repository logic, while CQRS allows for a clear separation between read and write operations, potentially requiring flexible query capabilities.

- **TypeORM, Sequelize, MikroORM**: These are full-fledged Object-Relational Mapping (ORM) libraries. They offer advanced features such as change tracking, automatic migration generation, and a unit of work pattern. However, these features might be overkill for projects with simple repository logic or those that heavily rely on DDD and CQRS.
- **Objection.js**: Acts as a middle ground by being a wrapper over Knex.js. It provides model definitions for constructing complex queries and still grants access to the low-level Knex.js API.
- **Kysely**: A TypeScript-first query builder that emphasizes type safety and flexibility in query construction. It is particularly suited for projects that value type safety and do not require the full spectrum of ORM features. Kysely does not enforce a specific data modeling approach, making it a good fit for DDD and CQRS patterns.


## Decision

TypeScript Support: Kysely is designed with TypeScript in mind, offering excellent type safety and autocompletion features. This aligns with our project's use of TypeScript and enhances developer productivity.
Simplicity and Flexibility: Kysely strikes a balance between simplicity and the ability to write complex queries. It fits well with the project's need for a tool that supports DDD and CQRS without the overhead of an ORM.
No Assumptions on Data Modeling: Unlike ORMs, Kysely does not enforce a particular way of modeling data. This flexibility is beneficial for projects using DDD, where the domain model might not directly map to the database schema.

For these reasons, Kysely is selected for thi sproject.

## Consequences

- Enhanced Type Safety: By using Kysely, we leverage TypeScript's capabilities to reduce runtime errors and improve code quality.
- Developer Productivity: The intuitive API and type safety features of Kysely are expected to boost developer productivity.
- Flexibility in Query Construction: Kysely's flexibility allows for crafting optimized queries that suit our DDD and CQRS patterns without the constraints of an ORM.
- Migration Management: We will need to manage migrations separately, but this allows for greater control and the ability to use tools specifically designed for migrations.
