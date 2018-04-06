var http = require('http'),
    path = require('path'),
    express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    ejs = require('ejs'),
    nconf = require('nconf'),
    winstonLogger = require('winston'),
    mongoose = require('mongoose');


/* EJS SYNTAX TREE */

var objIndex = {
    register: 'REGISTER',
    login: 'LOGIN',
    home: 'HOME'
};
var objHome = {
    home: 'HOME'
};
var logger = winstonLogger.createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5
    },

});

var person= require('./db/mgoose');
var person1 = new person.createUser({name:'Alice'});
person.createUser.find({name:'Alice'}, (err,res) =>{
    console.log(res.map(person => {
        return person.name
    }))
})



nconf.argv();

var type = nconf.get('env') || 'dev';

var port = null;
var data = null;
/* FUNCTION WHO GET DATA FROM CONFIG */

// console.log('Procees env ', process.env);

function getConfigData(err, content) {
    if (err) {
        console.log(err);
        return null;
    } else {
        data = JSON.parse(content);
        if (data['PORT']) {
            port = data['PORT']
        } else {
            throw new Error('Config file without PORT setting')
        }
    }
}

/* LADDER OF TYPES PACK */
switch (type) {
    case 'prod': {
        fs.readFile('./config/prod.json', 'utf8', (err, content) => {
            getConfigData(err, content);
            console.log('Listen ', port);
            app.listen(port);
        });
        break;
    }
    case 'dev': {
        fs.readFile('./config/dev.json', 'utf8', (err, content) => {
            getConfigData(err, content);
            console.log('Listen ', port);
            app.listen(port);
        });
        break;
    }
    default:
        port = 3000;
}

// console.log('env ' + type);


var app = express();

var urlEncodedParser = bodyParser.urlencoded({extended: false});

app.use(cookieParser());

app.set('views', path.join(__dirname, 'public'));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');


app.use(function (request, response, next) {

    var now = new Date();
    var hour = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var miliseconds = now.getMilliseconds();
    var data =
        'Time: ' + hour + ':' + minutes + ':' + seconds + ':' + miliseconds + '; '
        + 'Method: ' + request.method + '; '
        + 'URl: ' + request.url + '; '
        + 'Cookies: keys: ' + Object.keys(request.cookies).join(' ') + ', values: ' + Object.values(request.cookies).join(' ') + ' ' + '; '
        + 'Hostname: ' + request.hostname + '; '
        + 'StatusCode: ' + response.statusCode + '; '
        + 'User agent: ' + request.get('user-agent') + '; ';

    // console.log(data);
    fs.appendFile("./public/server.log", data + "\n", (res, req) => {
    });
    next();
});
app.get('/', (req, res) => {
    res.render('index', objIndex)
});

app.route('/register')
    .get((req, res) => {
        res.render('register')
    })
    .post(urlEncodedParser, (req, res) => {
        console.log();
        res.render('home', objHome);
    });

app.get('/log', (req, res) => {
    fs.readFile('./public/server.log', (err, content) => {
        if (err) {
            res.end('Error');
        } else {
            res.end(content, 'utf8');
        }
    })
})

app.get('/home', (req, res) => {
    res.render('home', objHome)

});
app.get('/login', (req, res) => {
    res.redirect('/register')
});
app.get('/admin', (req, res) => {
    res.end('<h1>GET Admin</h1>')
});

app.get('/*', (req, res) => {
    res.render('404')
});


