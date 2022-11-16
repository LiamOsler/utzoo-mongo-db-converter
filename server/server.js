var express = require('express');
var morgan = require('mongoose');
var mongoose = require('mongoose');
const bodyParser = require('body-parser'); 


const routes = require("./routes") // new

var { credentials, clusterURL } = require('./credentials');
var dbURI = `mongodb+srv://${credentials.username}:${credentials.password}@${clusterURL}`;


var port = 3000;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { 

        console.log("DB Connected"); 
        console.log("Listening on port " + port)

		const app = express()
        app.use(bodyParser.json({limit: '5mb'}));
        app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));


		app.use("/", routes) // new

		app.listen(port, () => {
			console.log("Server has started!")
		})
    })
.catch(err => console.log(err));

