const fs = require('fs');

const UTZOO_dir = './UTZOO/';

const fileList = [];

fs.readdirSync(UTZOO_dir).forEach(file => {
    console.log(file);
    fileList.push(file);
});

console.log(fileList);