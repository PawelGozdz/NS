/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: {
      // dependencyTypes: [
      //   "npm",
      //   "npm-dev",
      //   "npm-optional",
      //   "npm-peer",
      //   "npm-bundled",
      //   "npm-no-pkg",
      // ],
      path: [
        "node_modules",
        "dist"
      ]
    },

    includeOnly: "^src/[^/]+",
    // focus: {
    //   "path": "^src/[^/]+",
    // "depth": 3
    // },
    // reaches: "^src/core/exception-filters/exception.filter.ts+",

    tsPreCompilationDeps: false,

    tsConfig: {
      fileName: "./tsconfig.json",
    },

    exclude: {
      path: "^(e2e-tests|node_modules)"
    },

    /* How to resolve external modules - use "yarn-pnp" if you're using yarn's Plug'n'Play.
       otherwise leave it out (or set to the default, which is 'node_modules')
    */
    // externalModuleResolutionStrategy: "yarn-pnp",

    progress: { type: "performance-log" },

    // reporterOptions: {
    //   archi: {
    //     collapsePattern:
    //       "^src/contexts/auth/users/[^/]+",
    //   },
    // },
    // "reporterOptions": {
    //   "dot": {
    //     "theme": {
    //       "graph": {
    //         "splines": "ortho"
    //       },
    //       "modules": [
    //         {
    //           "criteria": { "matchesReaches": true },
    //           "attributes": {
    //             "fillcolor": "lime"
    //           }
    //         },
    //         {
    //           "criteria": { "matchesReaches": false },
    //           "attributes": {
    //             "fillcolor": "lightgray",
    //             "fontcolor": "gray"
    //           }
    //         }
    //       ]
    //     }
    //   }
    // }
    "reporterOptions": {
      "dot": {
        "theme": {
          "graph": {
            "splines": "ortho"
          },
          "modules": [
            {
              "criteria": { "matchesHighlight": true },
              "attributes": {
                "fillcolor": "yellow",
                "penwidth": 2
              }
            },
          ]
        }
      }
    }
  },
};