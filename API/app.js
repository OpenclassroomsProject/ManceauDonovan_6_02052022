const express = require('express');
const app = express();
// const helmet = require("helmet");

const UserRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

// app.use(helmet());


const mongoose = require('mongoose');
const db = {
    Name: 'hottakes',
    username: 'admin',
    password: 'm8LeV8o2MiL4zjLy',

}
const uriMongodb = `mongodb+srv://${db.username}:${db.password}@Cluster0.xe73p.mongodb.net/${db.Name}?retryWrites=true&w=majority`

mongoose.connect(uriMongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    const corsWhitelist = [
        'http://localhost:4200',
        'https://localhost:4200',
        'http://localhost:3000',
        'https://localhost:3000'
    ];

    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {

        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    }
    next();
});
app.use(express.json());

//==================== Routes =======================
app.use('/api/auth', UserRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/images', express.static(__dirname + '/images'));





module.exports = app;