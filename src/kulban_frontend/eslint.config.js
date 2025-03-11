import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslintPluginSvelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import svelteConfig from "./svelte.config.js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import { includeIgnoreFile } from "@eslint/compat";

import { fileURLToPath } from "node:url";

const gitignorePath = fileURLToPath(new URL("../../.gitignore", import.meta.url));

export default tseslint.config(
	{ files: ["src/**/*.{js,mjs,cjs,ts}"] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				App: "writable",
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginSvelte.configs["flat/recommended"],
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
		files: [
			"src/**/*.svelte",
			"src/*.svelte",
			"src/**/*.svelte.ts",
			"src/*.svelte.ts",
			"src/**/*.svelte.js",
			"src/*.svelte.js",
		],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				svelteConfig,
			},
		},
	},
	includeIgnoreFile(gitignorePath),
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
