import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

/**
 * Flat config (ESLint 9+). `next lint` was removed in Next.js 16, so linting
 * runs through the `eslint` binary directly -- see the `lint` npm script.
 */
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      'next-env.d.ts',
      // Scraped reference markup and generated data, not project source.
      'pages/**',
      'public/**',
      'data/**',
      '*.log',
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    rules: {
      // `declare namespace Gtag` in lib/analytics.ts types a third-party global.
      // Ambient declarations cannot be expressed as ES modules.
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],

      // Pre-existing debt, surfaced as warnings so the gate stays actionable
      // rather than blocking on a codebase-wide retype. Tracked, not ignored.
      '@typescript-eslint/no-explicit-any': 'warn',

      // React-Compiler-era rules from eslint-plugin-react-hooks v6. They flag
      // legal patterns throughout working UI code; warn until those components
      // are revisited deliberately.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },

  {
    // Build tooling and one-off maintenance scripts are CommonJS by design.
    files: ['scripts/**/*.js', 'jest.config.js', 'jest.setup.js', '*.config.js', 'next.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];

export default config;
