const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const erreurConnexion = 'Paire login/mot de passe incorrecte';

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Utilisateur créé'}))
                .catch(error => {
                    console.log("test");
                    res.status(400).json({error})})
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
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
                                'RANDOMTOKEN',
                                {expiresIn: '24h'}
                            )
                        });
                    }
                })
                .catch(error => res.status(500).json({error}));
        }
    })
    .catch(error => res.status(500).json({error}));
};
