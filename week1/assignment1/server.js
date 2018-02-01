const express = require('express')
const path = require("path")
const app = express()
const bodyParser = require("body-parser")
var fs = require('fs')

app.listen(8080, function () {
	console.log('Example app listening on port 8080!')
})

app.use('/', express.static('public'));
app.use('/level/2/', express.static('secret'));
app.use('/superSecret', express.static('superSecret'));
app.use(bodyParser.urlencoded({extended: true}))

app.post('/myaction', function(req, res){
	var input = req.body.fname
	console.log('input ', input)
	if(input == "pdntspa" || input == "apstndp"){		
		// app.use('/congrats', express.static('congrats'));
		res.writeHead(200, {'Content-Type': 'text/html'});
		// res.write("  _                                                                                  \n");
		// res.write(" /   _  ._   _  ._ _. _|_     |  _. _|_ o  _  ._   _ |   \_/ _             o ._  | | \n");
		// res.write(" \_ (_) | | (_| | (_|  |_ |_| | (_|  |_ | (_) | | _> o    | (_) |_|   \/\/ | | | o o \n");
		// res.write("             _|                                                                      \n");
		res.write('<div class="centerHeading"> <center> 	<img src="superSecret/images/giphy.gif" /> 	</center> </div>')
		
		res.end("\n\n");

		console.log('end')
	}
	else{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("Hmm, try again.");
		res.end("\n\n");		
	}
});

