const fs = require('fs'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	helmet = require('helmet'),
	authRoutes = require('./routes/auth'),
	usersRoutes = require('./routes/users'),
	teamsRoutes = require('./routes/teams'),
	initIo = require('./helpers/socket').initIo;

const app = express(),
	accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'));

// CORS POLICY
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
	next();
});

// SOME CONFIGS
app.use(morgan('combined', { stream: accessLogStream }));
app.use(helmet());
app.use(bodyParser.json());
const mul = require('./middlewares/multerUploader');
app.use(mul.single('image'));

// APIS

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/teams', teamsRoutes);

// ERROR HANDLER
app.use((error, req, res, next) => {
	console.log('error.message', error.message);
	console.log('error.satusCode', error.statusCode);

	res.status(error.statusCode || 500).json({ error: error.message || `Something Went Wrong: ${error.toString()}` });
});

// DB, SERVER CONNECTION
const mongoURL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.71gmc.mongodb.net/${process.env
		.DB_NAME}?retryWrites=true&w=majority`,
	mongoConfigs = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true
	},
	port = 2300;

mongoose
	.connect(mongoURL, mongoConfigs)
	.then(() => {
		console.log('Connected...');
		const httpServer = app.listen(process.env.PORT || port);

		const io = initIo(httpServer);

		io.on('connection', socket => {
			console.log(socket.id);
		});
	})
	.catch(err => {
		console.log('Failed To Connect...', err);
	});
