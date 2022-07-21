const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const erreurConnexion = 'Paire login/mot de passe incorrecte';
const dotenv = require('dotenv');
dotenv.config();
 
exports.signup = (req, res, next) => {
    if ( /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(req.body.email)){
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({message: 'Utilisateur créé'}))
                    .catch(error => {res.status(500).json({error})})
            })
            .catch(error => {res.status(500).json({error})});
    }else {res.status(500).json({message: 'Format identifiant incorrect'})}
};

exports.login = (req, res, next) => {
    if ( /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(req.body.email)){
        User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: erreurConnexion});
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ message: erreurConnexion});
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    {userId: user._id},
                                    process.env.TOKEN,
                                    {expiresIn: '3600s'}
                                )
                            });
                        }
                    })
                    .catch(error =>{res.status(500).json({message: error})})
            }
        })
        .catch(error => res.status(500).json({error}));
    } else {res.status(500).json('Format identifiant inccorect')}
};
