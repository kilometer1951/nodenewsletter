const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');





const app = express();

//mongodb://<dbuser>:<dbpassword>@ds249415.mlab.com:49415/nodenewsletter

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({ 
	resave: true,
	saveUnitialized: true,
	secret: "12345",
	store: new MongoStore({url: 'mongodb://root:kilometer1951@ds249415.mlab.com:49415/nodenewsletter'})

}));
app.use(flash());


app.route('/')
   .get((req, res, next) => {
   		res.render('home', { message: req.flash('success') });
   })
   .post((req, res, next) => {
      request({
      	url: 'https://us17.api.mailchimp.com/3.0/lists/9a1149f0a4/members',
      	method: 'POST',
      	headers: {
      		'Authorization': 'randomUser fa6d3fdf53b687741b32cb75384d1168-us17',
      		'Content-Type': 'application/json'
      	},
      	json: {
      		'email_address': req.body.email,
      		'status': 'subscribed'
      	}

      }, (err, response, body) => {
      		if (err) {
      			console.log(err);
      		}else{
      			req.flash('success', 'You have submitted your email');
      			return res.redirect('/');
      		}
      });
      
   });



app.listen(3000, (err) => {
	if(err){
		console.log(err);
	}else{
		console.log("Running on port 3000")
	}
});