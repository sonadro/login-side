// packages
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// create server
const server = express();

// variables
const port = 80;

// view engine & middleware
server.set('view engine', 'ejs');
server.use(express.static('public'));
server.use(express.json());

// start server
server.listen(port);
console.log('Listening for requests on port', port);

// routes
server.get('/', (req, res) => res.redirect('/hjem'));
server.get('/hjem', (req, res) => res.render('index'));
server.get('/glemt-passord', (req, res) => res.render('newPassword'));
server.get('/logg-inn', (req, res) => res.render('login'));
server.get('/lag-bruker', (req, res) => res.render('createAccount'));

// encrypt
server.post('/encrypt', (req, res) => {
    const {parcel} = req.body;

    // encrypt password
    if (parcel) {
        bcrypt.hash(parcel, saltRounds, (err, hash) => {
            res.status(200).send({status: 'received', pass: hash});
        });
    } else {
        res.status(400).send({status: 'failed'});
    }
});

// 404
server.use((req, res) => res.status(404).render('404'));