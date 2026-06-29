// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Global settings for all files
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Specific override for test files and utilities
    files: ["**/*.test.ts", "**/tests.utils.ts", "**/setup.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Mocks need 'any' to live
    },
  },
  {
    ignores: ["dist/**", "node_modules/**"]
  }
);