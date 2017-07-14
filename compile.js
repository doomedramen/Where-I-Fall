const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const replaceExt = require('replace-ext');
const less = require('less');

const ejsRoot = path.join(__dirname, 'src');
const lessRoot = path.join(__dirname, 'src', 'style');

function EJS() {


    const ejsOutputPath = path.join(__dirname);

    const ejsData = {};
    const ejsOptions = {};

    const files = fs.readdirSync(ejsRoot);
    files.map(f => {

        if (path.extname(f) === '.ejs') {

            const fullPath = path.join(ejsRoot, f);
            const fullOutputPath = replaceExt(path.join(ejsOutputPath, f), '.html');

            ejs.renderFile(fullPath, ejsData, ejsOptions, function (err, str) {

                if (err) {
                    console.error(err);
                }

                writeFile(str, fullOutputPath);


            });

        }

    });
}

function writeFile(str, path) {
    if (fs.existsSync(path)) {
        let err = fs.unlinkSync(path);

        if (err) {
            console.error(err);
        }
    }

    fs.writeFile(path, str, {}, err => {
        if (err) {
            console.error(err);
        }
    })
}

function LESS() {


    const files = fs.readdirSync(lessRoot);

    const lessOutputPath = path.join(__dirname);

    files.map(f => {

        if (path.extname(f) === '.less') {

            const fullPath = path.join(lessRoot, f);
            const fullOutputPath = replaceExt(path.join(lessOutputPath, f), '.css');

            const asString = fs.readFileSync(fullPath, 'utf8');

            less.render(asString).then((output, err) => {

                if (err) {
                    console.error(err);
                }

                writeFile(output.css, fullOutputPath);


            })
                .catch(err => {
                    console.error(err);
                })


        }

    });

}

EJS();
LESS();

