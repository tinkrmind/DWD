var express = require('express');
var bodyParser = require('body-parser');
var calcEntropy = require('binary-shannon-entropy');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

function callback(req, res){
	res.send('');
	// console.log(req);
}

app.use(express.static('views'));

app.post('/postANumber', function(req, res){
	console.log(req.body.nameOfNumber);
	var entropy = calcEntropy(Buffer(req.body.nameOfNumber));
	res.send('The entropy of the number you sent is: '+entropy);
})

port = 8080;
app.listen(port, () => console.log('Example app listening on port '+port))