# extension-toolkit
[WIP] Toolkit to help you build your own custom extensions!

## Installation

```
npm install -f @directus/extension-toolkit
```

## Usage

To create a new extension, run `directus-extensions create [type] [name]`:

```
directus-extensions create interface my-first-interface
```

This will create a folder in the current directory with all the files you need to create your own extension.

## Building the extensions

An extension needs to be transpiled (from Vue to JS) in order for the application to use it. To do this, run `npm run build` in the folder you  created with the command above.
