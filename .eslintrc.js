module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
		"airbnb-base",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
		"project": "./tsconfig.json",
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
		"import",
        "@typescript-eslint"
    ],
    "rules": {
		"@typescript-eslint/interface-name-prefix": ["error", "always"],
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/indent": ["error", "tab"],
		"@typescript-eslint/camelcase": ["error", {
			"properties": "never"
		}],
		"@typescript-eslint/ban-ts-ignore": "off",
		"@typescript-eslint/semi": ["error"],
		"import/no-cycle": "off",
		"no-restricted-syntax": ["error", "WithStatement"],
		"comma-dangle": ["error", "never"],
		"no-param-reassign": ["error", {
			"props": false
		}],
		"no-dupe-class-members": "off",
		"no-await-in-loop": "off",
		"arrow-parens": "off",
		"no-continue": "off",
		"no-tabs": ["error", {
			"allowIndentationTabs": true
		}],
		"indent": "off",
		"semi": "off",
		"linebreak-style": ["error", "windows"]
    },
	"overrides": [
		{
			"files": ["test/*.test.ts"],
			"env": {
				"jest": true
			}
		}
	]
};