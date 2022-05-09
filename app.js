require('dotenv').config()
const TelegramBot = require("node-telegram-bot-api");
var session = require('express-session')
const passport = require('passport')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs=require('express-handlebars');
var fileupload = require("express-fileupload");

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
let apiRouter  =  require('./routes/api_v3')

var app = express();
let cors = require('cors')
const mongoose = require('mongoose');
const { compare } = require('bcrypt');



// const token = process.env.TOKEN; // User Verification BOT

// const bot = new TelegramBot(token, { polling: true });

// app.use((req,res,next)=>{
//   res.header("Access-Control-Allow-Origin","*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With,Content-Type,Accept,Authorization"
//   );
//   if(req.method=== "OPTIONS"){
//     res.header("Access-Control-Allow-Methods","PUT,POST,PATCH,DELETE,GET");
//     return res.status(200).json({})
//   }
//   next();
// })

const chatId = 5265243832

// MongoDB setup Here

const ConnectWithRetry = ()=>{
  mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=>{
    const res = "Connected Successfully" 
    // bot.sendMessage(chatId, res);
    console.log(res);
  }).catch((error)=>{
    const res = "Failed to Connect Retrying"
    console.log(res);
    // bot.sendMessage(chatId, res);

    setTimeout(ConnectWithRetry,5000)

  })
  

}


ConnectWithRetry()



// const domainsFromEnv = process.env.CORS_DOMAINS || ""

// const whitelist = domainsFromEnv.split(",").map(item => item.trim())

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }
// app.use(cors(corsOptions))


app.use(cors({
  origin: "*"
}));





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname + '/views/layout/',partialsDir:__dirname + '/views/partials/'}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// express Session codes here
app.use(session({
  secret:"hello_world",
  resave: true,
  saveUninitialized: true,
  cookie:{maxAge:6000000}
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

app.use('/apiV3',apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




