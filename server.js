const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // Heroku port override

var app = express()

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
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

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    })
})

app.listen(port, () => { console.log(`Server is running on port ${port}`) });