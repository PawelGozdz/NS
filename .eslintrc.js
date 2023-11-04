module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 2023,
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'security'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // === Not Optional: Essential for most projects ===

    // TypeScript Rules
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',

    // Backend/Node.js Rules
    'global-require': 'error',
    'handle-callback-err': 'error',
    'no-buffer-constructor': 'error',
    'no-path-concat': 'error',
    'no-console': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',

    // Import and Dependencies
    'import/order': ['error', { 'newlines-between': 'always' }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['**/test/**/*.ts'] }],

    // Security Rules
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-eval-with-expression': 'warn',
    'security/detect-unsafe-regex': 'warn',

    // === Optional: Consider enabling these ===

    // TypeScript Rules
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/class-literal-property-style': 'warn',
    '@typescript-eslint/no-invalid-void-type': 'warn',
    '@typescript-eslint/no-misused-new': 'warn',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
    '@typescript-eslint/prefer-enum-initializers': 'warn',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/prefer-string-starts-ends-with': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'warn',
    '@typescript-eslint/triple-slash-reference': 'warn',
    '@typescript-eslint/unbound-method': 'warn',
    '@typescript-eslint/naming-convention': 'warn',

    // Import and Dependencies
    'import/no-cycle': 'warn',
    'import/no-dynamic-require': 'warn',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling'],
          'index'
        ],
        'newlines-between': 'always'
      }
    ],

    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.{e2e-spec,spec}.{js,ts}',
          '**/*.test.ts',
          '**/*.spec.ts',
          '**/__tests__/**',
          '**/__mocks__/**',
          '**/__features__/**',
          '**/__features__/**',
          '**/webpack.config.js',
          '**/webpack.config.*.js',
          '**/setup-tests.js',
          '**/*fixture.ts',
          '**/seeds/*.ts',
        ]
      }
    ],
  },
  overrides: [

    {
      files: ['**/*.{spec,e2e-spec}.ts'],
      rules: {
        'no-underscore-dangle': 'off',
        '@typescript-esling/no-unsafe-assignment': 'off',
        '@typescript-esling/unbound-method': 'off',
        '@typescript-esling/require-await': 'off',
        '@typescript-esling/no-unsafe-member-access': 'off',
        '@typescript-esling/no-unsafe-argument': 'off',

      }
    },
    {
      files: ['**/*.ts'],
      rules: {
        'import/prefer-default-export': 'off',
        'radix': 'off',
        'class-methods-use-this': 'off',
      }
    }
  ]
};
