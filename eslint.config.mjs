import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  {
    rules: {
      'react-hooks/incompatible-library': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
  {
    ignores: ['*.js', 'storybook-static', 'supabase', 'database.types.ts'],
  },
];

export default eslintConfig;
