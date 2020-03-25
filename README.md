# Directus Toolkit
[WIP] Toolkit to help you build your own custom extensions!

## Installation

```
npm install -g @directus/extension-toolkit
```

## Usage

To update documentaton (readmes) of any module, run `directus-toolkit docs [type] [name]`.
`type` and `name` are optional.

To update the button component:
```
directus-toolkit docs components v-button
```

To update every module:
```
directus-toolkit docs
```

To create a new extension, run `directus-toolkit templates <type> <name>`.
Run this command in the root directory.

```
directus-toolkit templates interfaces my-first-interface
```