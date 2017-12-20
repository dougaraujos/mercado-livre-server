/**
 * Module Dependencies
 */

import express from 'express';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';
import errorHandler from 'errorhandler';

// Additional Modules
import config from 'config';
import routes from 'routes';


/**
 * Create Express app
 */

let app = express();


/**
 * Express Configuration and Setup
 */

app.locals.application  = config.name;
app.locals.version      = config.version;
app.locals.description  = config.description;
app.locals.author       = config.author;
app.locals.keywords     = config.keywords;
app.locals.custom		= config.custom;
app.locals.environment	= config.environment;

// Port to listen on
app.set('port', config.port);


// Body parsing middleware supporting
app.use(bodyParser.json());


// CORS
app.use(function(request, result, next) {
	result.setHeader('Access-Control-Allow-Origin', '*');
	next();
});

// Validation Middleware 
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		const namespace = param.split('.');
		let formParam = namespace.shift();

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}

		return {
			field : formParam,
			message : msg,
			value : value
		};
	}
}));


/**
 * Routes/Routing
 */

app.use('/api', routes);


/**
 * Error Handling
 */

// Handle 404 Errors
app.use(function (req, res, next) {
	res.status(404);
	res.send('Endpoint not found!');
	return;
});


if (app.get('environment') !== 'production') {
	// Final error catch-all just in case
	app.use(errorHandler());
}


process.on('uncaughtException', function(err) {
	console.log('Node alert an uncaught exception:');
	console.error(err);
});


// Production 500 error handler (no stacktraces leaked to public!)
app.use(function (err, req, res, next) {
	var status = err.status || 500;
	res.status(status).send({
		'code': status,
		'error': 'Internal Server Error',
		'message': app.get('environment') === 'production' ? 'Ocorreu um erro inesperado.' : err.stack
	});
	return;
});


app.listen(config.port);
console.log('Express server started on port 3000.');