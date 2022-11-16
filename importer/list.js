import path from "path"
import fs from "fs"
import fetch from 'node-fetch';


let fileCount = 0; 
let fileTotal = 2104830;
let directoryCount = 0;
let directoryTotal = 56988;

async function postFile(absPath, data){
    const response = await fetch('http://localhost:3000/posts', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "user": {
          "path" : absPath,
          "content" : data
        }}),
    })
    const responseData = await response.json();

    if(fileCount % 100 == 0 || fileCount == 1){
        console.log("\n", responseData);

    }
    process.stdout.cursorTo(0);
    process.stdout.write((((fileCount/fileTotal)*100).toFixed(5) +"% Complete. Files read: " + fileCount + "/" + fileTotal ));


}

async function readDirectory(dir) {
    console.log("\nReading Directory: " + dir);

    for(const file of fs.readdirSync(dir)){
        const absPath = path.join(dir, file);
        if (fs.statSync(absPath).isDirectory()){
            directoryCount++;
            await readDirectory(absPath);
        }
        else{
            if(file != ".TARDIRPERMS_"){
                fileCount++;
                const data = fs.readFileSync(absPath, 'utf8');
                await postFile(absPath, data);
            }

        }
    }
}

readDirectory("../UTZOO/");






