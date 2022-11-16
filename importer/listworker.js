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
    "ddd MMM DD h:mm:ss YYYY",
    "DD MMM YY HH:mm:ss",
    "D MMM YY HH:mm:ss",
];

let fileCount = 0; 
let fileTotal = 2104830;
let directoryCount = 0;
let directoryTotal = 56988;

let currentTime, startTime;
startTime = new Date();

async function postFile(absPath, data){

    let fileHeaders = {
        filePath : "",
        relayVersion : "",
        path : "",
        from : "",
        newsgroups : "",
        subject : "",
        keywords : "",
        replyTo : "",
        messageId : "",
        sender : "",
        articleId : "",
        control : "",
        organization : "",
        lines : "",
    };
    
    const lines = data.split("\n");
    let headerStatus = true;

    const header = [];
    let date, postDateString;
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
    let dateCheck = false;
    let specDate, foundDate;

    for(let line of header){
        let lineFinal = line;

        if(line.includes("Path: ")){
            lineFinal = line.replace("Path: ", "");
            fileHeaders.path = lineFinal;
        }
        if(line.includes("From: ")){
            lineFinal = line.replace("From: ", "");
            fileHeaders.from = lineFinal;
        }
        if(line.includes("Newsgroups: ")){
            lineFinal = line.replace("Newsgroups: ", "");
            fileHeaders.newsgroups = lineFinal;
        }
        if(line.includes("Subject: ")){
            lineFinal = line.replace("Subject: ", "");
            fileHeaders.subject = lineFinal;
        }
        if(line.includes("Keywords: ")){
            lineFinal = line.replace("Keywords: ", "");
            fileHeaders.keywords = lineFinal;
        }
        if(line.includes("Message-ID: ")){
            lineFinal = line.replace("Message-ID: ", "");
            fileHeaders.messageId = lineFinal;
        }
        if(line.includes("Reply-To: ")){
            lineFinal = line.replace("Reply-To: ", "");
            fileHeaders.replyTo = lineFinal;
        }
        if(line.includes("Sender: ")){
            lineFinal = line.replace("Sender: ", "");
            fileHeaders.sender = lineFinal;
        }
        if(line.includes("Organization: ")){
            lineFinal = line.replace("Organization: ", "");
            fileHeaders.organization = lineFinal;
        }
        if(line.includes("Article-ID: ")){
            lineFinal = line.replace("Article-ID: ", "");
            fileHeaders.articleId = lineFinal;
        }
        if(line.includes("Control: ")){
            lineFinal = line.replace("Control: ", "");
            fileHeaders.control = lineFinal;
        }
        if(line.includes("Lines: ")){
            lineFinal = line.replace("Lines: ", "");
            fileHeaders.lines = lineFinal;
        }

        if(line.includes("Posted: ")){
            lineFinal = line.replace("Posted: ", "");
            dateCheck = true;
            postDateString = lineFinal;
        }
        if(line.includes("Date: ")){
            lineFinal = line.replace("Date: ", "");
            dateCheck = true;
            postDateString = lineFinal;
        }

        if(moment(lineFinal, formats, true).isValid()){
            if(dateCheck == true){
                specDate = moment(lineFinal).format("YYYY-MM-DD HH:mm:ss");
            }else{
                foundDate = moment(lineFinal).format("YYYY-MM-DD HH:mm:ss");
            }
        }
    }

    if(specDate){
        date = specDate;
    }
    else{
        date = foundDate;
    }

    const response = await fetch('http://localhost:3000/posts', {  
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ "user": {
            "filePath" : absPath,
            "content" : data,
            "header" : header.join("\n"),
            "body" : body.join("\n"),
            "date" : date,
            "postDate" : postDateString,
            "relayVersion" : fileHeaders.relayVersion,
            "path" : fileHeaders.path,
            "from" : fileHeaders.from,
            "newsgroups" : fileHeaders.newsgroups,
            "subject" : fileHeaders.subject,
            "keywords" : fileHeaders.keywords,
            "replyTo" : fileHeaders.replyTo,
            "messageId" : fileHeaders.messageId,
            "sender" : fileHeaders.sender,
            "articleId" : fileHeaders.articleId,
            "control" : fileHeaders.control,
            "organization" : fileHeaders.organization,
            "lines" : fileHeaders.lines
        }}),
    })
    const responseData = await response.json();

    if(fileCount % 100 == 0 || fileCount == 1){
        console.log("\n", responseData);

    }
    currentTime = new Date();
    process.stdout.cursorTo(0);
    process.stdout.write((((fileCount/fileTotal)*100).toFixed(5) +"% Complete. Files read: " + fileCount + "/" + fileTotal + " Time Elapsed: " + moment.utc(currentTime.getTime() - startTime.getTime()).format("HH:mm:ss:SSS")
    + " Estimated: " + moment.utc((currentTime.getTime() - startTime.getTime()) * (fileTotal/fileCount - 1)).format("HH:mm:ss:SSS")));

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






