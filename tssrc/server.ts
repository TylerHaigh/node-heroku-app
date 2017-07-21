const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express()

hbs.registerPartials(__dirname + '/../views/partials'); // need to use /../ to go up one folder

app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text: string) => {
    return text.toUpperCase();
})


app.use( (req, res, next) => {
    
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + "\n", (err) => {
        if (err)
            console.error('Cannot append to server.log');
    });
    
    // MUST CALL NEXT or it will not return result
    next();
} )

// app.use( (req, res, next) => {
//     res.render('maintenance.hbs');
// } )

// middleware is executed in the order it is registered
app.use(express.static(__dirname + "/public")); // Takes absolute path to folder


app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my humble shop'
    })
})

app.get('/about', (req, res) => {
    // res.send('<h1>About Page</h1>')
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to fulfill request'
    })
})

app.listen(3000, () => { console.log('Server is running on port 3000') });