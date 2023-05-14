#!/usr/bin/env node
const commander = require('commander');
const marked = require('marked');
const fs = require('fs-extra');
const path = require('path');

// Define our program
commander
    .version('1.0.0')
    .description('A CLI tool to convert Markdown to GitHub-styled HTML')
    .arguments('<file>')
    .action((file) => {
        const filePath = path.resolve(file);
        const fileName = path.basename(filePath, '.md');
        const dirName = path.dirname(filePath);

        // Read Markdown file
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Could not read file: ${filePath}`);
                process.exit(1);
            }

            // Convert Markdown to HTML
            const html = marked.parse(data);

            // Read GitHub CSS
            const css = fs.readFileSync(require.resolve('github-markdown-css'), 'utf8');

            // Create HTML file
            const htmlContent = `
        <style>
        ${css}
        </style>
        <article class="markdown-body">
        ${html}
        </article>
      `;

            // Write HTML file
            fs.writeFile(`${dirName}/${fileName}.html`, htmlContent, 'utf8', (err) => {
                if (err) {
                    console.error(`Could not write file: ${fileName}.html`);
                    process.exit(1);
                }

                console.log(`Converted ${fileName}.md to ${fileName}.html successfully!`);
            });
        });
    });

// Parse command line arguments
commander.parse(process.argv);
