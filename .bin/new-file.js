import { write } from 'fs';

'use strict';
const inquirer = require('inquirer');
const ejs = require('ejs');
const Configstore = require('configstore');
const { resolve, join } = require('path');
const { writeFileSync } = require('fs');
const pwd = process.cwd();
const templatesPath = join(__dirname, 'templates');
const templateFile = (x) => join(templatesPath, x)

const templates = {
    library: templateFile('library.js')
}

const config = new Configstore('tw-templates', { author: 'noteself' });


const questions = [
    {
        type: 'list',
        choices: Object.keys(templates),
        name: 'type',
        message: 'What kind of file do you want to create ?',
        default: config.get('type')
    },
    {
        type: 'input',
        name: 'author',
        message: 'Plugin author',
        default: config.get('author')
    },
    {
        type: 'input',
        name: 'module_name',
        message: 'Name your module',
        default: config.get('module_name')
    },
    {
        type: 'input',
        name: 'output',
        message: 'Where do you want to save the file ?',
        default: config.get('output'),
        filter: (input) => resolve(input)
    }
];

const main = async () => {

    const answers = await inquirer.prompt(questions);
    const { type: moduleType, output, module_name } = answers;
    config.all = answers;

    ejs.renderFile(templateFile(moduleType) , answers, { delimiter: ':' }, (err, str) => {

        if (err) {
            throw err;
        }

        writeFileSync(resolve(output, module_name + '.js'), str, 'utf8');
    
    });
}



main();