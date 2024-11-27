import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import parser from '@typescript-eslint/parser'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: 'module',
			parser: parser
		}
	},
	{
		rules: {
			'prettier/prettier': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': [
				'info',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	},
	{
		plugins: {
			'@typescript-eslint': eslintPlugin,
			'prettier': eslintPluginPrettier
		}
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended
]
