#!/usr/bin/env node
var commander = require('commander');
var marked = require('marked');
var fs = require('fs-extra');
var path = require('path');
// Define our program
commander
    .version('1.0.0')
    .description('A CLI tool to convert Markdown to GitHub-styled HTML')
    .arguments('<file>')
    .action(function (file) {
    var filePath = path.resolve(file);
    var fileName = path.basename(filePath, '.md');
    var dirName = path.dirname(filePath);
    // Read Markdown file
    fs.readFile(filePath, 'utf8', function (err, data) {
        if (err) {
            console.error("Could not read file: ".concat(filePath));
            process.exit(1);
        }
        // Convert Markdown to HTML
        var html = marked.parse(data);
        // Read GitHub CSS
        var css = fs.readFileSync(require.resolve('github-markdown-css'), 'utf8');
        // Create HTML file
        var htmlContent = "\n        <style>\n        ".concat(css, "\n        </style>\n        <article class=\"markdown-body\">\n        ").concat(html, "\n        </article>\n      ");
        // Write HTML file
        fs.writeFile("".concat(dirName, "/").concat(fileName, ".html"), htmlContent, 'utf8', function (err) {
            if (err) {
                console.error("Could not write file: ".concat(fileName, ".html"));
                process.exit(1);
            }
            console.log("Converted ".concat(fileName, ".md to ").concat(fileName, ".html successfully!"));
        });
    });
});
// Parse command line arguments
commander.parse(process.argv);
//# sourceMappingURL=mdc.js.map