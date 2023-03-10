// packages
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();

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
server.get('/nytt-passord', (req, res) => res.render('resetPassword'));

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
    const { uEmail, id } = req.body;
    const { pass, user, host } = require('./config.json');

    // create jwt
    const payload = {
        email: uEmail,
        userId: id
    }

    const secret = crypto.randomBytes(256).toString('hex');
    const token = jwt.sign(payload, secret, { expiresIn:  '10m'});

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
        subject: 'Reset passord p?? login-side',
        text: `Trykk p?? lenken under for ?? resette passordet ditt:
            \nhttp://localhost/nytt-passord?token=${token}&secret=${secret}\n
            \nOBS! Hvis det ikke var du som sendte denne foresp??rselen, s?? kan du ignorere denne meldingen.`
    }

    // send mail
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.error(error);
            res.status(400).send({ status: 'failed' });
        } else {
            console.log(`Email sent: ` + info.response);
            res.status(200).send({ status: 'success', token });
        };
    });
});

// reset password
server.post('/reset-encrypt', (req, res) => {
    const { password, token, secret } = req.body;    

    if (password) {
        // jwt verify
        try {
            const decoded = jwt.verify(token, secret);

            // send pw
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    console.error(err);
                };
    
                res.status(200).send({
                    status: 'success',
                    hash
                });
            });
        } catch (error) {
            console.error(error.message);
        }
    } else {
        res.status(400).send({ status: 'failed'});
    }
});

// get database
server.post('/request-db', (req, res) => {
    const apiKey = process.env.API_KEY;
    const authDomain = process.env.AUTH_DOMAIN;
    const databaseURL = process.env.DATABASE_URL;
    const projectId = process.env.PROJECT_ID;
    const storageBucket = process.env.STORAGE_BUCKET;
    const messagingSenderId = process.env.MESSAGING_SENDER_ID;

    if (apiKey && authDomain && databaseURL && projectId && storageBucket && messagingSenderId) {
        res.status(200).send({
            apiKey,
            authDomain,
            databaseURL,
            projectId,
            storageBucket,
            messagingSenderId
        });
    } else {
        res.status(400).send({ err: 'Couldn\'t get database credentials. '});
    }
});

// 404
server.use((req, res) => res.status(404).render('404'));