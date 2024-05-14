const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const express = require("express");
const cookieSession = require("cookie-session"); // Cookie-based session middleware.
const session = require("express-session"); // Create a session middleware
const http = require("http");
const events = require("events");
const bcrypt = require('bcrypt');
const expressValidator = require("express-validator");
global.appEvent = new events.EventEmitter();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/authentication')
.then(()=>console.log("connection succesful"))
.catch((err)=> console.error(err))


console.log("Config Files: ", process.env["CONFIG_FILES"]);
global.config = require("./config/config.json");

// Normalize a port into a number, string, or false.
const normalizePort = function(val) {
	const port = parseInt(val, 10);
	if (isNaN(port) && port > 0) return val;
	if (port >= 0) return port;
	return false;
};


(async () => {
	try {
		let port = process.env.APP_PORT || 80;
		port = normalizePort(port);
		// Create Express App
		const app = express();
		app.set("port", port);


		const server = http.createServer(app);

		// Express Custom Function
		require("./common/express-custom-function")(express);

		server.on("error", onError);
		server.on("listening", onListening);
		server.listen(port, () => {
			console.log(`Server started on port ${port}`);
		});

		// Handle
		process.on("uncaughtException", function(err) {
			// console.log(err.message);
		});


		// HTTP server listener "error" event.
		function onError(error) {
			if (error.syscall !== "listen") {
				throw error;
			}
			const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
			// handle specific listen errors with friendly messages
			switch (error.code) {
			case "EACCES":
				console.error(`${bind} requires elevated privileges`);
				process.exit(1);
				break;
			case "EADDRINUSE":
				console.error(`${bind} is already in use`);
				process.exit(1);
				break;
			default:
				throw error;
			}
		}

		// HTTP server "listening" event.
		function onListening() {
			const addr = server.address();
			const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
			debug(`Listening on ${bind}`);
		}


		/** **************************body parser */
		app.use(
			bodyParser.json({
				limit: "50mb",
				parameterLimit: 1000000
			})
		);
		app.use(
			bodyParser.urlencoded({
				limit: "50mb",
				extended: true,
				parameterLimit: 1000000
			})
		);

		app.use(
			expressValidator({
				errorFormatter: function(param, msg, value) {
					const namespace = param.split(".");
					const root = namespace.shift();
					let formParam = root;
					while (namespace.length) {
						formParam += `[${namespace.shift()}]`;
					}
					return {
						param: formParam,
						msg: msg
					};
				}
			})
		);

		/** ******************************************** */
		app.use(cookieSession(config.cookie));
		// express session
		app.use(session(config.session));

		app.use(cookieParser());


    const users = require('./model/users.js');
const user = await users.countDocuments();
if(!user){

  await users.create({
    email : "admin@gmail.com",
    password : await bcrypt.hash("admin@123", 5),
    name:"admin",
    phone: 99638956958,
    role:"admin"
  });
}

		// load middleware functions
		const Middlewares = require("./common/middlewares");
		global.Middlewares = new Middlewares();

		// define auth helper
		const {verifyAuthToken, checkAuth} = require("./helpers/auth");
    
    app.use('/register', require('./routes/register'));
    app.use('/login', require('./routes/login'));
    // user verifyAuthToken middleware for verify auth token
    app.use(verifyAuthToken);
    // Router initialize with auth token
    app.use(checkAuth);
    app.use('/logout', require('./routes/logout'));
    app.use('/users', require('./routes/users') );
    app.use('/profile',require('./routes/profile'));
    
		console.log("Routes bind.");

	} catch (err) {
		console.error(err);
		console.log("----------------- DB Error and Exit -----------------");
		process.exit(3); // DB not connect
	}
})();



