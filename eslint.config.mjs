import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["app/layout.tsx"],
    rules: {
      // App Router root layout is the global document (Pages Router _document equivalent).
      // Fonts and stylesheets added here apply to every page — the rule's concern does not apply.
      "@next/next/no-page-custom-font": "off",
    },
  },
]);

export default eslintConfig;
