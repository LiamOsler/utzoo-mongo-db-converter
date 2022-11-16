import path from "path"
import fs from "fs"
import fetch from 'node-fetch';
import moment from 'moment';
moment().format();
var formats = [
"YYYY",
"YYYYMM",
"YYYY-MM",
"M/D",
"MM/DD",
"YYYYMMDD",
"YYYY-MM-DD",
"YYYY_MM_DD",
"YYYY.MM.DD",
"M/D/YY",
"MM/DD/YY",
"MM/DD/YYYY",
"DD MMM YY",
"DD MMM YYYY",
"DD MMMM YYYY",
"MMM D, YY",
"MMM D, YYYY",
"MMM DD, YYYY",
"MMMM D, YYYY",
"MMMM DD, YYYY",
"YYYYMMDDHHmm",
"YYYYMMDD_HHmm",
"YYYY.MM.DD.HHmm",
"YYYY-MM-DD-HHmm",
"YYYY-MM-DD_HHmm",
"YYYY.MM.DD.HH.mm",
"YYYY-MM-DD-HH-mm",
"YYYY-MM-DD HH:mm",
"YYYY-MM-DD h:mm A",
"YYYY-MM-DD hh:mm A",
"YYYY-MM-DD @ h:mm A",
"YYYYMMDDHHmmss",
"YYYY.MM.DD.HHmmss",
"YYYY-MM-DD-HHmmss",
"YYYY-MM-DD_HHmmss",
"YYYY-MM-DD_HHmm.ss",
"YYYY.MM.DD.HH.mm.ss",
"YYYY-MM-DD-HH-mm-ss",
"YYYY-MM-DD HH:mm:ss",
"YYYY-MM-DD HH:mm.ss",
"YYYY-MM-DD h:mm:ss A",
"YYYY-MM-DD hh:mm:ss A",
"YYYY-MM-DD @ h:mm:ss A",
"dd MMM D YY",
"ddd MMM D YY",
"ddd MMM D YYYY",
"ddd MMM DD YYYY",
"dddd, MMM D YYYY",
"dddd, MMMM D, YYYY",
"dddd, MMMM DD, YYYY",
"h:mm A",
"hh:mm A",
"@ h:mm A",
"ddd MMM D YY h:mm A",
"ddd MMM D YYYY h:mm A",
"ddd MMM DD YYYY h:mm A",
"dddd, MMM D YYYY h:mm A",
"dddd, MMMM D, YYYY h:mm A",
"dddd, MMMM DD, YYYY h:mm A",
"ddd MMM D YY hh:mm A",
"ddd MMM D YYYY hh:mm A",
"ddd MMM DD YYYY hh:mm A",
"dddd, MMM D YYYY hh:mm A",
"dddd, MMMM D, YYYY hh:mm A",
"dddd, MMMM DD, YYYY hh:mm A",
"ddd MMM D YY @ h:mm A",
"ddd MMM D YYYY @ h:mm A",
"ddd MMM DD YYYY @ h:mm A",
"dddd, MMM D YYYY @ h:mm A",
"dddd, MMMM D, YYYY @ h:mm A",
"dddd, MMMM DD, YYYY @ h:mm A",
"ddd MMM  D HH:mm:ss YYYY",
"ddd MMM DD HH:mm:ss YYYY",
"ddd MMM  D HH:mm:ss YYYY",
"ddd MMM DD h:mm:ss YYYY",
"ddd MMM D h:mm:ss YYYY",
"ddd MMM DD h:mm:ss YYYY",
"ddd MMM  D h:mm:ss YYYY",
"ddd MMM DD h:mm:ss YYYY"
];

let fileCount = 0; 
let fileTotal = 2104830;
let directoryCount = 0;
let directoryTotal = 56988;

let currentTime, startTime;
startTime = new Date();

async function postFile(absPath, data){
    const lines = data.split("\n");
    currentTime = new Date();


    let headerStatus = true;

    const header = [];
    let date;
    const body = []; 
    for(let line of lines){
        if(headerStatus == true){
            if(line == ""){
                headerStatus = false;
            }
            else{
                header.push(line);
            }
        }
        else{
            body.push(line);
        }
    }

    for(let line of header){
        if(moment(line, formats, true).isValid()){
            date = moment(line).format("YYYY-MM-DD HH:mm:ss");
        }
    }

    const response = await fetch('http://localhost:3000/posts', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "user": {
          "path" : absPath,
          "header" : header.join("\n"),
          "body" : body.join("\n"),
          "date" : date
        }}),
    })
    const responseData = await response.json();

    if(fileCount % 100 == 0 || fileCount == 1){
        console.log("\n", responseData);

    }
    process.stdout.cursorTo(0);
    process.stdout.write((((fileCount/fileTotal)*100).toFixed(5) +"% Complete. Files read: " + fileCount + "/" + fileTotal + " Time Elapsed: " + moment.utc(currentTime.getTime() - startTime.getTime()).format("HH:mm:ss:SSS")
    + " Time Remaining: " + moment.utc((currentTime.getTime() - startTime.getTime()) * (fileTotal/fileCount - 1)).format("DD:HH:mm:ss:SSS")));

}

async function readDirectory(dir) {
    // console.log("\nReading Directory: " + dir);

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






