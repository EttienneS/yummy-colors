import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["components/game/**/*.tsx"],
    rules: {
      "@next/next/no-css-tags": "off",
      "react/no-inline-styles": "off"
    }
  }
];

export default eslintConfig;
