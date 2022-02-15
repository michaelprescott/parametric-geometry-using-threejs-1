#!/bin/zsh
## ----------------------------------------------------------------------------
## About
## -----
## This script provides a reference to the commands and tools developers
## executed during project setup and maintenance. It may also be executed
## to bootstrap a new project, but should not be used within an existing project
## directory.
##
## When starting a new project:
## Copy setup.sh and common-vars.sh into a [project]/setup/
## ============================================================================

## Clear the screen and scrollback buffer
clear && printf '\e[3J'

## Do not `source` this script.  The path related vars defined in common-vars.sh
## would unintentionally be relative to the location of the common-vars.sh file.
REPO_ROOT_DIR=${0:a:h:h}
SCRIPT_DIR=${0:a:h}

## read and eval each line in common-vars.sh to insure they resolve relative
## to setup.sh, the currently executing script.
while read i; do eval $i; done < ${REPO_ROOT_DIR}/setup/common-vars.sh


## ----------------------------------------------------------------------------
## Usage: Don't.
## -------------
##
## Prerequisites
## -------------
## * macOS - Not tested on other platforms
##
## Since you are obviously going to use this anyway:
## 1. Review Prerequisites
## 2. Open the Terminal
## 3. cd [~/Projects]/[project name]   # Or whereever you cloned or extracted this project
## 4. chmod u+x ./setup/setup.sh       # Grant yourself permission to execute this script
## 5. ./setup/setup.sh                 # Before running, read and understand every step
##                                       in this script!
## ============================================================================

## ----------------------------------------------------------------------------
## Project initialization

## Ex.
node --version > .nvmrc ## Set the node version to use
npm init -y             ## Node project initialization

## ============================================================================

## ----------------------------------------------------------------------------
## Install Dev Dependencies
npm install typescript --save-dev      # TypeScript transpiler
npm install @types/node --save-dev     # Type definitions for Node.js
npm install http-server --save-dev     # A simple static HTTP server

npm install webpack --save-dev         # Building tools and plugins
npm install webpack-cli --save-dev
npm install webpack-dev-server --save-dev
npm install pnp-webpack-plugin --save-dev
npm install copy-webpack-plugin --save-dev
npm install html-webpack-plugin --save-dev
npm install webpack-subresource-integrity --save-dev
npm install webpack-bundle-analyzer --save-dev
npm install ts-loader --save-dev
npm install style-loader --save-dev
npm install css-loader --save-dev
npm install sass --save-dev
npm install sass-loader --save-dev
npm install ejs-compiled-loader --save-dev
npm install string-replace-loader --save-dev
npm install eslint --save-dev
npm install eslint-webpack-plugin --save-dev
npm install prettier --save-dev
npm install eslint-plugin-prettier --save-dev
npm install eslint-config-prettier --save-dev
npm install @typescript-eslint/eslint-plugin --save-dev
npm install jsdom --save-dev
npm install @types/jsdom --save-dev

npm install dayjs                      # Date manipulation and formatting
npm install uuid                       # For browser and node uuid for common results
npm install @types/uuid --save-dev     # between lambda functions and client using v5()

npm install jest --save-dev            # unit testing
npm install ts-jest --save-dev
npm install @types/jest --save-dev

## Answer no to the Jest question about whether or not to enable TypeScript.
## Instead, add the line: preset: "ts-jest" to the jest.config.js file afterwards.
## Also, add `/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */`
## above the `module.exports = {` line at top.
npx jest --init
## The following create a basic Jest configuration file which will inform Jest
## about how to handle .ts files correctly
#npx ts-jest config:init

npm install three --save
npm install @types/three --save-dev
## ============================================================================

## ----------------------------------------------------------------------------
## TypeScript project initialization
npx tsc --init          ## Create default tsconfig.json
## ============================================================================

## ----------------------------------------------------------------------------
## Project and workspace configuration files
local newFileName="./.editorconfig"
cat > ${newFileName} <<'EOL'
# EditorConfig is awesome: http://EditorConfig.org
# top-most EditorConfig file
root = true
# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
indent_style = space
indent_size = 2
[node_modules/**/*,dist/**/*]
insert_final_newline = false
indent_style = none
indent_size = none
EOL

local newFileName="./.prettierrc"
cat > ${newFileName} <<'EOL'
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 120,
  "tabWidth": 2
}
EOL

curl -o .gitignore https://www.toptal.com/developers/gitignore/api/osx,node,windows,webstorm,jetbrains,sublimetext,visualstudiocode,yarn

mkdir -p src
#curl -o ./src/three.js https://threejs.org/build/three.js


