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
    maxDepth: 16,

    // includeOnly: ["^libs/[^/]+", "^src/[^/]+"],
    // includeOnly: ["^src/[^/]+"],
    // focus: {
    //   "path": "^src/api-gateway/[^/]+",
    // "path": "^src/api-gateway/auth/[^/]+",
    // "depth": 3
    // },
    reaches: "^src/contexts/[^/]+",
    // reaches: "^src/api-gateway/[^/]+",
    // reaches: "^libs/common/src/decorators/[^/]+",
    // prefix: `vscode://file/${process.cwd()}/`,
    tsPreCompilationDeps: true,

    tsConfig: {},
    // tsConfig: {
    //   fileName: "./tsconfig.json",
    // },

    exclude: {
      path: "^(src/e2e-tests|node_modules+)"
      // path: "^(src/e2e-tests|node_modules|src/contexts/categories/[^/]+)"
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
      "archi": {
        // "theme": {
        //   "graph": {
        //     "splines": "ortho"
        //   },
        //   "modules": [
        //     {
        //       "criteria": { "matchesHighlight": true },
        //       "attributes": {
        //         "fillcolor": "blue",
        //         "penwidth": 2
        //       }
        //     },
        //   ]
        // }
        collapsePattern: "^(node_modules/[^/]+)",
        showMetrics: true,
        // theme: {
        //   modules: [
        //     {
        //       criteria: { collapsed: true },
        //       attributes: { shape: "tab" }
        //     }
        //   ]
        // }
      }
    }
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
  },
};