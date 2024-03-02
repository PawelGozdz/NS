/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      dependencyTypes: ['npm', 'npm-dev', 'npm-optional', 'npm-peer', 'npm-bundled', 'npm-no-pkg'],
      path: ['node_modules', 'dist'],
    },
    maxDepth: 3,
    includeOnly: ['^libs/[^/]+', '^src/[^/]+'],

    // focus: {
    //   "path": "table-names\\.ts$",
    // "path": "^src/api-gateway/features/http/[^/]+",
    //   "depth": 1,
    // },
    // reaches: "^src/[^/]+",
    // reaches: "^src/([^/]+)/.+",
    // reaches: ["table-names\\.ts$"],
    tsPreCompilationDeps: true,

    tsConfig: {},

    exclude: {
      path: '^(src/e2e-tests|node_modules+)',
    },

    progress: { type: 'performance-log' },

    reporterOptions: {
      archi: {
        collapsePattern: '^src/[^/]+',
        theme: {
          graph: {
            splines: 'ortho',
          },
          modules: [
            {
              criteria: { matchesReaches: true },
              attributes: {
                fillcolor: 'lime',
              },
            },
            {
              criteria: { matchesReaches: false },
              attributes: {
                fillcolor: 'lightgray',
                fontcolor: 'gray',
              },
            },
          ],
        },
      },
    },
  },
};
