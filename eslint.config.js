import js from "@eslint/js"
import plugin from "@typescript-eslint/eslint-plugin"
import parser from "@typescript-eslint/parser"
import importPlugin from "eslint-plugin-import-x"
import perfectionist from "eslint-plugin-perfectionist"
import globals from "globals"

export default [
    {
        ignores: ["build/**"],
    },
    js.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: parser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        plugins: {
            "@typescript-eslint": plugin,
            "import-x": importPlugin,
            "perfectionist": perfectionist,
        },
        rules: {
            "no-undef": "off",
            "no-explicit-any": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    "format": ["camelCase", "UPPER_CASE", "PascalCase"],
                    "selector": ["function", "variable", "parameter", "classProperty", "classMethod"],
                    "leadingUnderscore": "allow",
                    "filter": {
                        "regex": "^__",
                        "match": false,
                    },
                },
            ],
            "no-multiple-empty-lines": [
                "error",
                { "max": 1 },
            ],
            "indent": [
                "error",
                4,
                { "SwitchCase": 1 },
            ],
            "quotes": [
                "error",
                "double",
            ],
            "semi": [
                "error",
                "never",
            ],
            "comma-dangle": [
                "error",
                "always-multiline",
            ],
            "import-x/extensions": [
                "error",
                "always",
                {
                    "ts": "never",
                    "tsx": "never",
                    "js": "always",
                    "jsx": "always",
                    "ignorePackages": true,
                },
            ],
            "perfectionist/sort-imports": [
                "error",
                {
                    "type": "alphabetical",
                    "order": "asc",
                    "customGroups": [
                        {
                            "groupName": "value-default",
                            "selector": "import",
                            "modifiers": ["value", "default"],
                        },
                        {
                            "groupName": "value-named",
                            "selector": "import",
                            "modifiers": ["value", "named"],
                        },
                        {
                            "groupName": "type-default",
                            "selector": "type",
                            "modifiers": ["default"],
                        },
                        {
                            "groupName": "type-named",
                            "selector": "type",
                            "modifiers": ["named"],
                        },
                    ],
                    "groups": [
                        "value-default",
                        "value-named",
                        "type-default",
                        "type-named",
                        "unknown",
                    ],
                },
            ],
            "perfectionist/sort-exports": "error",
        },
    }
]