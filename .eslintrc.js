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