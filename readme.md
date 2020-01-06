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
- `start`: Start a tw server for development on watch mode. It only watches the plugins directory.
- `watch`: Rebuild plugins on any source code change. Check `nodemon.json` for config details. It watches the `src` folder aditionally
- `build-plugin`: executes the build pipeline with the plugin directory as target. If you have the dev server running this should trigger a hot reload.
- `clean`: Deletes the output directory
- `build`: builds the distribution output files. Note that this is only for checking locally that the output files works, the actual build and deploy happens automatically on travis CI. Also note that several plugins are on above locations (pouchdb and tiddlypouch), check the `.env` file for the required paths. Also note that the folder separator varies from windows to linux/mac
- `tw`: Helper script that executes tiddlywiki through **node** loading first the ENV variables at the `.env` file.
- `tw-dev`: Helper script that executes tiddlywiki through **nodemon** loading first the ENV variables at the `.env` file.

## Developing
For now you will need to use two terminals if you want hot code reload. One for tiddlywiki server and another one for the source code automatic rebuild.
Run `npm start` on one terminal and `npm run watch` on another one.
Every time a change to the `src` folder is made, the build pipeline is executed, which outputs to the plugins directory, triggering a reload on the tiddlywiki server.

I really want to improve this process, but I may forget to document it here, so always check `package.json/scripts` if any doubt.