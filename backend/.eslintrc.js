module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', '@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    'no-console': 'warn',
    'prefer-arrow-callback': 'error',
    'arrow-spacing': 'error',
    eqeqeq: 'error',
    curly: 'error',
    'no-var': 'error',
  },
  env: {
    node: true,
    es2020: true,
  },
};
