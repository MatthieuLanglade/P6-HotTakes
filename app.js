const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const dotenv = require('dotenv');
var helmet = require('helmet');
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const app = express();

// Dotenv
dotenv.config();
const identifiantMongo = process.env.IDENTIFIANTMONGO;
const mdpMongo = process.env.MDPMONGO;

// Mise en place MongoDB
mongoose.connect(`mongodb+srv://${identifiantMongo}:${mdpMongo}@mongoclustlit.ghozo.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middlewares
  // Analyse du corps des requêtes
  app.use(express.json());
  // Helmet
  app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
  // Autorisations des requêtes
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });
  // Routes 
  app.use('/api/sauces', saucesRoutes);
  app.use('/api/auth', userRoutes);
  app.use('/images', express.static(path.join(__dirname, 'images')));
    
module.exports = app; 