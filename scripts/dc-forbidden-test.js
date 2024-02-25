const src = '(src|@app)'
const libs = '(libs|@libs)';

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-imports-to-libs-from-src",
      comment:
        "Libs should contain no dependencies (except node_modules)",
      severity: "error",
      to: {
        path: `^${src}`,
        // pathNot: "\\.spec\\.(js|ts)$|\\.d\\.ts$"
      },
      from: { path: `^${libs}/[^/]+` },
    },
    {
      name: "no-imports-to-core-from-src-or-contexts",
      comment:
        "Core can import only from libs, config or node_modules",
      severity: "error",
      to: {
        path: `^${src}/[^/]+`,
        pathNot: [
          `^${src}/core`,
          `^${src}/config`,
        ]
      },
      from: { path: `^${src}/core`, },
    },
    {
      name: "no-imports-from-upper-layer",
      comment:
        "Contexts modules should not depend from upper API-GATEWAY layer",
      severity: "error",
      from: { path: `[^/]+/contexts` },
      to: { path: "[^/]+/api-gateway" },
    },
    {
      // TODO not working
      name: "no-import-to-from-upper-layer",
      comment:
        "Not allowed to import from application or infrastructure to domain layer",
      severity: "error",
      from: { path: `domain` },
      to: {
        path: `(application|infrastructure)`
      },
    },
    {
      // TODO not working
      name: "no-import-to-from-upper-layer",
      comment:
        "Not allowed to import from infrastructure to application layer",
      severity: "error",
      from: { path: `application` },
      to: {
        path: `infrastructure`
      },
    },
  ],
};