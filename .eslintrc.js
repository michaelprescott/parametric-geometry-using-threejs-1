module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    // Opinionated overrides of the default recommended rules:
    "@typescript-eslint/indent": "off", // Disabled until typescript-eslint properly fixes indentation (see https://github.com/typescript-eslint/typescript-eslint/issues/1232) - there are recurring issues and breaking changes, and this rule usually isn't violated due to autoformatting anyway.
    "@typescript-eslint/interface-name-prefix": "off",
    //"prettier/trailing-comma": "off"
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "prettier/prettier": [
      "warn",
      {
        trailingComma: "all",
      },
    ],
  },
  overrides: [
    {
      // Specific overrides for JS files as some TS rules don't make sense there.
      files: ["**/dist/**/*.js"],
      rules: {
        "prettier/prettier": "off",
      },
    },
    {
      // Specific overrides for JS files as some TS rules don't make sense there.
      files: ["**/dist/**/*.js"],
      rules: {
        "no-var": 0,
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-use-before-define": "off",
      },
    },
    {
      // Specific overrides for JS files as some TS rules don't make sense there.
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/typedef": "off",
        "compat/compat": "off",
      },
    },
    {
      files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: {
        mocha: true,
      },
    },
  ],
};
