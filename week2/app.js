var express = require('express');
var bodyParser = require('body-parser');
var calcEntropy = require('binary-shannon-entropy');
var zxcvbn = require('zxcvbn');
var passwordHash = require('password-hash');
var result;
var beautify = require("json-beautify");

var app = express();
var userlist =['username', 'email', 'passwordHash'];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('views'));

app.post('/postANumber', function(req, res){
	console.log(req.body.nameOfNumber);
	var entropy = calcEntropy(Buffer(req.body.nameOfNumber));
	res.send('The entropy of the number you sent is: '+entropy);
})

app.post('index.html', function(req,res){
	// console.log(req.body.nameOfNumber);
	res.send('Why are you here??');
})

function returnHTML(score, crackTime, warning, suggestions){
	if(score<2){
		title="We REALLY need to talk about password strength";
		bkgColor = '#f44141;';
		bkgColorText = '#f65555;';
	}else if(score<4){
		title="We need to talk about password strength";
		bkgColor = '#f44194;';
		bkgColorText = '#f556a0;';
	}else{
		title="You have a  pretty strong password."
		bkgColor = '#b841f4 ;';
		bkgColorText = '#d287f8 ;';
	}

	var html = '<!DOCTYPE html> <html> <head> <title>We need to talk about passwords.</title> </head> <body> <style> body{background-color:'
	html+=String(bkgColor);
	html+='} .header{text-align :center;font-family: Arial, Helvetica, sans-serif;} .text{background-color:';
	html+=String(bkgColorText);
	html+='padding: 15px 20px 15px 20px;text-align:center;font-family: Arial, Helvetica, sans-serif;} .image{text-align:center;padding: 15px 20px 15px 20px;} .warning{text-align:center;margin-top: 2px;font-family: Arial, Helvetica, sans-serif; color:white;} .footer{text-align:right;font-family: Arial, Helvetica, sans-serif;} button { padding: 15px 20px 15px 20px; color: #FFF; background-color: #5ac3ed; font-size: 18px; text-align: center; font-family: Arial, Helvetica, sans-serif; margin-bottom: 0px; width: 25%; } </style> <div class="header"> <h1>';
	html+=title;
	if(score<3){
		html+='</h1> </div> <div class = "text"> <h2>Your password can be cracked in ';
		html+=String(crackTime);	
	}else{
		html+='</h1> </div> <div class = "text"> <h2>Your password will take ';
		html+=String(crackTime);	
		html += ' to be cracked.';
	}
	
	if(warning !=null )	{
		html+='</h2> <h3> ';
		html+=String(warning);
	}
	if(suggestions.length > 0)	{
		html+='</h3> <h3> You should ';
		html+=String(suggestions[0]);
	}
	html+="</h3></div>";
	// html+=" <div class='image'> <form action='/showFullAnalysis/'> <button type='submit'>Full analysis.</button> </form> </div> <div class = 'warning'> <h5>[WARNING: This will show your password as plain text on the screen]</h5> <br> </div>";
	html+=" <div class = 'image'> <img src='/password_strength.png'/> </div> <br> <div class = 'footer'> This calculation is based on <a href = 'https://blogs.dropbox.com/tech/2012/04/zxcvbn-realistic-password-strength-estimation/'>zxcvbn.</a> </div> </body> </html>";

	console.log('Score: ' + score);
	console.log('Your password can be cracked in ' + crackTime);
	if(warning !=null )	{
		console.log("WARNING " + warning);
	}
	if(suggestions !=null )	{
		console.log("You should")
		for(i=0; i<suggestions.length;i++){
			console.log(suggestions[i]);
		}		
	}
	return html;
}

app.post('/testMyPassword', function(req,res){
	app.use(express.static('views'));
	// console.log(req.body.user_password);
	
	var password = req.body.user_password;
	var hash = passwordHash.generate(password);
	var username = req.body.user_name;
	var email = req.body.user_email;
	var user_data = [username, email];
	userlist.push([username, email, hash]);

	result = zxcvbn(password, user_data);

	var score =result.score;
	var crackTime = result.crack_times_display.offline_fast_hashing_1e10_per_second;
	var warning = result.feedback.warning;
	var suggestions = result.feedback.suggestions;

	res.send(returnHTML(score, crackTime, warning, suggestions));
})

app.all('/listAllUsers/', function(req, res){
	res.send(userlist);
})

app.all('/showFullAnalysis/', function(req,res){
	res.send(result);
})

port = 8080;
app.listen(port, () => console.log('Example app listening on port '+port))