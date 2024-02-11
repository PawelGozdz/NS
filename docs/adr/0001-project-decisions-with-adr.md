# 1. Project decisions with ADR

Date: 2024-02-11

## Status

2024-02-11 accepted

## Context

There is a need to document all important project decisions to be able to reference and recall them in the future. It's also very useful to have a mechanism of reviewing proposed decisions.

Providing a well known structure for such documents should also help with documenting and reading such changes in the future. One of the commonly used flows for documenting them is architecture decision record (ADR, well described here: https://github.com/joelparkerhenderson/architecture_decision_record) which provides few simple concepts to manage these documents.

For the decision document format itself, there are multiple suggested templates, with a possibility to create our own. A good format should allow to clearly specify what is the situation when the decision is being made, what are the possible options, and what is the outcome of a decision.

One possibility is documenting it in the wiki system like confluence which is currently used in NeuroSYS. The other option is storing project decisions in the repository itself.

## Decision

We'll use the ADR format to store project decision documents.

For the ADR document template we'll use "ADR template by Michael Nygard" (https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) which is quite simple, while still providing a clear structure to follow. It's commonly integrated in various ADR tools, should someone choose to use them.

We'll store ADR records in the repository instead of external wiki to allow for easier linking in code, merge requests and to use a review mechanism that all git platforms provide.

## Consequences

- All important project decisions will be documented.
- Developers will have to create a document every time they want to introduce a major project change.
