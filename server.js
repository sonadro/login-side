// packages
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');

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
server.get('/bruker', (req, res) => res.render('bruker'));

// encrypt
server.post('/create-encrypt', (req, res) => {
    const { userPw } = req.body;

    // encrypt password
    if (userPw) {
        // password
        bcrypt.hash(userPw, saltRounds, (err, hash) => {
            res.status(200).send({ status: 'success', password: hash });
        });
    } else {
        res.status(400).send({ status: 'failed' });
    }
});

// login-encrypt
server.post('/login-encrypt', (req, res) => {
    const { userPw, dbUserPw } = req.body;

    // encrypt password
    if (userPw) {
        bcrypt.compare(userPw, dbUserPw, (err, match) => {
            if (err) {
                console.error(err);
            }
            
            res.status(200).send({ status: 'received', match});
        });
    } else {
        res.status(400).send({ status: 'failed' });
    }
});

// forgot password
server.post('/forgot', (req, res) => {
    const { uEmail } = req.body;
    const { pass, user, host } = require('./config.json');

    // transporter account
    const transporter = nodemailer.createTransport({
        host,
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user,
            pass: pass
        },
    });

    // settings
    const mailOptions = {
        from: user,
        to: uEmail,
        subject: 'Glemt passord på login-side',
        text: 'Trykk her.'
    }

    // send mail
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error(error);
            res.status(400).send({ status: 'failed' });
        } else {
            console.log(`Email sent: ` + info.response);
            res.status(200).send({ status: 'success'});
        };
    });
});

// 404
server.use((req, res) => res.status(404).render('404'));