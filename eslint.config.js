import js from "@eslint/js";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import path from "path";
import tseslint from "typescript-eslint";

// eslint-disable-next-line no-undef
const __dirname = new URL(".", import.meta.url).pathname;

/** @type {import('eslint').Config} */
export default [
  { ignores: ["dist"] }, // 📦 Ignore the 'dist' folder, we don't care about bundled stuff here!
  js.configs.recommended, // ✅ Use ESLint's recommended rules - good starting point!
  ...tseslint.configs.recommended, // 📝 Add TypeScript's recommended rules - because we love types!
  {
    files: ["**/*.{ts,tsx}"], // 🔍 Apply these rules to all TypeScript and TSX files
    languageOptions: {
      ecmaVersion: 2020, // ECMA Version
      globals: {
        ...globals.browser, // 🌐 We're in a browser environment!
      },
      parser: tseslint.parser,
      parserOptions: {
        project: [
          path.resolve(__dirname, "./tsconfig.app.json"),
          path.resolve(__dirname, "./tsconfig.node.json"),
        ],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks, // 🎣 Register the React Hooks plugin
      "react-refresh": reactRefresh, // 🔄 Register the React Refresh plugin
      "react-compiler": reactCompiler, // ⚛️⚡️ Register the React Compiler plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules, // 🎣 Apply React Hooks recommended rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }, // 🔄⚡️ Warn if we're not exporting components correctly for React Refresh
      ],
      // Disable the base no-unused-vars rule as it can conflict with the TypeScript one
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_", // ⚠️ No unused variables allowed! (but _ is okay for unused args)
          // Ignore parameter/variable names in type definitions and interfaces
          varsIgnorePattern: "^Type|^Interface|^I[A-Z]",
        },
      ],
      "react/react-in-jsx-scope": "off", // ⚛️ No need to import React in JSX anymore!
      "react-compiler/react-compiler": "error", // ⚛️⚡️ Enable React Compiler rules
    },
    settings: {
      react: {
        version: "detect", // ⚛️ Automatically detect React version
      },
      "import/resolver": {
        node: {
          paths: ["src"], // 🚚 Look for imports in the 'src' directory
          extensions: [".js", ".jsx", ".ts", ".tsx"], // 🚚 ...and these file extensions
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "eslint:recommended": "off",
      "plugin:react/recommended": "off",
      "plugin:react-hooks/recommended": "off",
      "plugin:import/recommended": "off",
      "plugin:jsx-a11y/recommended": "off",
      "plugin:@typescript-eslint/recommended": "off",
    },
  },
];
