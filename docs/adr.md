# ADR documentation

In this project, we use Architecture Decision Records (ADR) to document all important decisions and common development practices. See [ADR-0001](adr/0001-document-project-decisions-with-adr.md) for details.

If you're creating your first ADR file, take a look at the format that we're using stored in the [template file](adr/TEMPLATE.md) and review other existing documents for reference. You can also take a look at the original article describing our format that can be found here: https://github.com/joelparkerhenderson/architecture_decision_record.

## Generating new ADR

The simplest way to generate a new ADR document is to use an `adr` tool from the npm. The following command:

```sh
npx adr n "New adr title"
```

Will create a new document in the format that we're using and update a table of contents stored in the README.md file. Alternatively, create a new file based on the TEMPLATE.md file and update the table of contents manually.

An ADR is initially created with a `proposed` status. Since we use the merge request review process as a way of accepting the given ADR document, an ADR status should be changed to `accepted` before a merge request with a new document is merged to the master branch.
