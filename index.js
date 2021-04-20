const express = require("express");

const app = express();

const cookieSession = require("cookie-session");

const authMiddlewares = require("./middlewares/auth");

const db = require("./models/db");

const expressLayouts = require('express-ejs-layouts');

const bodyParser = require("body-parser");

//express ejs-layouts
app.use(expressLayouts);

app.use(express.json());

//session
app.use(cookieSession({
    name: 'session',
    keys: [process.env.COOKIE_KEY || 'secret'],
    maxAge: 24*60*60*1000
}));

//use authMiddlewares
app.use(authMiddlewares);

//use ejs
app.set("view engine", "ejs");

app.set("views", "./views");

//use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static('public'));

//use router
app.use(require('./routes/index'));
app.use(require('./routes/todo'));
app.use(require('./routes/auth'));
app.use(require('./routes/home'));
app.use(require('./routes/profile'));
app.use(require('./routes/admin'));

//connect to postgres
db.sync().then(function(){
    app.listen(process.env.PORT || 3000, function(){
        console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
      });
}).catch(console.error);




