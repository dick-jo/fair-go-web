import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import sortClassMembersPlugin from "eslint-plugin-sort-class-members";
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';

export default [
	js.configs.recommended,
	...tsEslint.configs.recommended,
	...eslintPluginSvelte.configs['flat/recommended'],
	eslintPluginPrettierRecommended, // must be last
	{
		languageOptions: {
			globals: globals.browser
		},
		plugins: {
			import: importPlugin,
			"sort-class-members": sortClassMembersPlugin,
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'prettier/prettier': 'error',
			'no-empty-pattern': 'off',
			indent: 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					vars: 'all',
					args: 'after-used',
					ignoreRestSiblings: true,
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true
					}
				}
			],
			'sort-class-members/sort-class-members': 'error',
			'sort-imports': [
				'error',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					allowSeparatedGroups: false
				}
			]
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		}
	}
];
