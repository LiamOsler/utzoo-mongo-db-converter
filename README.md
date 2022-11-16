# utzoo-mongo-db-converter
Some scripts for converting the UTZOO Usenet archive to a Mongo Database

## Background
I recently found out about the [UTZOO Usenet Archive](https://archive.org/details/utzoo-wiseman-usenet-archive), a collection of something like two million [Usenet](https://en.wikipedia.org/wiki/Usenet) posts archived by [Henry Spencer](https://en.wikipedia.org/wiki/Henry_Spencer) from 1981 to 1991. I wanted to play around with the data, so I wrote some Node script to convert the files to a Mongo database. It's a little bit hacky, but it works.


### Getting the data:
The data was available on the Internet Archive. You could download the data from the [UTZOO Usenet Archive](https://archive.org/details/utzoo-wiseman-usenet-archive) page. After legal demands were placed requesting the internet archive to remove the data, the data was removed and replaced with its checksum. Fortunately, some [friendly folks on Reddit](https://www.reddit.com/r/DataHoarder/comments/i2btuu/utzoo_archives_have_been_removed_from_archiveorg/) have preserved the data. You can download the UTZOO archive from a torrent linked in that post.

### The files
The UTZOO archive has individual Usenet post saved individual files. This makes searching its contents pretty slow, especially running a search using in Windows. [GREP](https://man7.org/linux/man-pages/man1/grep.1.html) was faster, but still doesn't take advantage of search indexing. Seeking through the contents of files this way is always dead slow. I thought about a few ways of being able to quickly search the data. [Maybe a RAM disk?](https://en.wikipedia.org/wiki/RAM_drive). Faster storage? The drive I'm working from is already pretty fast (Gen 3 NVMe). Maybe I could use a database? I decided try using a database.

### Why Mongo?
I've been playing around with Mongo for a bit. Other implementations of database of the UTZOO archives are [SQL based](https://www.reddit.com/r/java/comments/bkm5h5/how_i_converted_utzoo_usenet_archive_from/) and I thought it might be interesting to try something different, NoSQL. What I would like to test is the ability to quickly search the data. I'm not sure if Mongo is the best choice for this, but I thought UTZOO could be a good test case for [Mongo's search indexing](https://www.mongodb.com/basics/search-index) features.

### Decompressing the data:
Rather than decompress the data in Node, I decompressed it using 7zip, so once you retrieve the archive, you'll also need to do so.

## How to run:
You must have the contents of the UTZOO Usenet archive extracted in a directory named `UTZOO`

(If you are using MongoDB.com and) open the `server` folder and:

2. Create a file called `credentials.js`. In it, include:
```js
const clusterURL = `your_cluster_url`;
const credentials = {
    username : "your_username",
    password : "your_password"
}

module.exports = {
    credentials: credentials,
    clusterURL: clusterURL
}
```
3. Modify `server.js`:
```js
var { credentials, clusterURL } = require('./credentials');
var dbURI = `mongodb+srv://${credentials.username}:${credentials.password}@${clusterURL}`;
```
4. Run `node server` to start the server.


Or, if you are using a local database: 

1. Install [MongoDB](https://www.mongodb.com/) and start a server
2. Open the `server` folder and modify `server.js`:
```js
var {clusterURL } = require('./credentials');
var dbURI = `${clusterURL}`;
```
3. change `clusterURL` in `credentials.js` to the URL of your local database, or replace the string with your database url, ex:
```js
var dbURI = "mongodb://localhost:27017";
```
Run `node server` to start the server.


This will start an express based API that I am using to make modifications to the database. To start adding data to the database, open the folder named `importer` and run:
`node listworker.js`

This will start inserting the data into the database. It will take a while.

### Problems:
I am still working on parsing the data, so the importer is not complete. I will update this when it is. There is a wide variety of header formats in the UTZOO archive. This includes a variety of different date codes. Later headers include a key to the header's value, early headers lack this. I still need to fix some of the date parsing. There's also a few headers that I haven't accounted for yet. I'm working on it.

## Performance
This script recursively crawls through the UTZOO directory and adds the files to the Mongo database using fetch calls to the `express` based API. Saving the data to the database took about 12 hours on my machine to a local MongoDB server.


There's definitely faster ways to convert the data here ¯\_(ツ)_/¯. Ditching the Middleware (Express) and interacting directly with the DB from the main script would be a good start. I think using worker threads could increase performance.

##Code:
The code is available on [Github](
