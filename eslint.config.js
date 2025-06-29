import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

export default defineConfig([
	{
		name: "app/files-to-lint",
		files: ["**/*.{js,mjs,jsx,vue}"]
	},

	globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

	{
		languageOptions: {
			globals: {
				...globals.browser
			}
		}
	},

	js.configs.recommended,
	...pluginVue.configs["flat/essential"],
	skipFormatting,
	{
		name: "app/custom-rules",
		rules: {
			"padded-blocks": ["error", "never"],
			"vue/max-attributes-per-line": [
				"error",
				{
					singleline: 1,
					multiline: 1
				}
			],
			"vue/first-attribute-linebreak": [
				"error",
				{
					singleline: "ignore",
					multiline: "below"
				}
			],
			"vue/html-closing-bracket-newline": [
				"error",
				{
					singleline: "never",
					multiline: "always"
				}
			]
		}
	}
])
