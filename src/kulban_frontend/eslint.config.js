import prettier from "eslint-config-prettier";
import js from "@eslint/js";
import { includeIgnoreFile } from "@eslint/compat";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";
import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import svelteConfig from "./svelte.config.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const gitignorePath = fileURLToPath(new URL("../../.gitignore", import.meta.url));

export default ts.config(
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs["flat/recommended"],
	prettier,
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: "./tsconfig.json",
				extraFileExtensions: [".svelte"], // This is a required setting in `@typescript-eslint/parser` v4.24.0.
			},
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				App: "writable",
			},
		},
	},
	{
		files: ["**/*.svelte", "*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				svelteConfig,
			},
		},
	},
	eslintPluginPrettierRecommended,

	{
		ignores: [
			"node_modules/",
			"dist/",
			"build/",
			".svelte-kit/",
			"*.config.*",
			"*.json",
			"vitest-*",
		],
	},
	{
		rules: {
			"prefer-const": "off",
			"prettier/prettier": [
				"error",
				{
					singleQuote: false,
					//parser: "flow",
					trailingComma: "all",
					endOfLine: "lf",
					plugins: ["prettier-plugin-svelte"],
					overrides: [{ files: "*.svelte", options: { parser: "svelte" } }],
				},
			],
		},
	},
);
