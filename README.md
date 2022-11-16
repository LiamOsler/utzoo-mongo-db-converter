# utzoo-mongo-db-converter
Some scripts for converting the UTZOO Usenet archive to a Mongo Database

# How to run:
You must have the contents of the UTZOO usenes archive extracted in a directory names `UTZOO`

Open the `server` folder and create a file called `credentials.js`. In it, include:
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

Then, in the `server` folder, run:

`node server.js`

This will start an express based API that I am using to make modifications to the database. To start adding data to the database, open the folder named `importer` and run:

`node listworker.js`

This will start the process of writing the contents of the file to your Mongo Database.


There's definitely faster ways to convert the data here ¯\_(ツ)_/¯. Ditching the Middleware (Express) and interacting directly with the DB from the main script would be a good start. It's also probable that using worker threads could increase performance. 
