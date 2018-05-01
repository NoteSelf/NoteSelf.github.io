# NoteSelf official page repository
This repository is for the official page of NoteSelf.
It has tiddlers and code that automatically builds the brand and online verisons.

## Community
**If you have doubts or problems** please visit our forum!!! https://forum.noteself.org/

## Development

This repository has been created as a development environment for NoteSelf. It is not intended for any other usage and should not be used in any other way. It is not a NS server, neither a way to run NoteSelf on your local machine.

### Scripts

This repository contains a collection of scripts on the package.json to facilitate the dev workflow.
Run any of them just by doing `npm run scriptName` where scriptName is one scripts contained on `package.json`.
Here is a list of the relevant ones:

- `add-module`: asks a bunch of questions and creates a new module using one of the built-in templates. Very useful for bootstrapping new files.
- `tw-dev`: spawns a tiddlywiki server using nodemon for hot reloading. Check `nodemon.json` for config details. It only watches the plugins directory.
- `dev`: executes the build pipeline with the plugin directory as target. If you have the dev server running this should trigger a hot reload.
- `clean`: Deletes the output directory
- 