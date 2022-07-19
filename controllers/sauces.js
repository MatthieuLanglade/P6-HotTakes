const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceObject.name,
    manufacturer: sauceObject.manufacturer,
    description: sauceObject.description,
    mainPepper: sauceObject.mainPepper,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat: sauceObject.heat,
    likes: 0,
    dislikes: 0
  });
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json({error})})
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        res.status(200).json(sauce)})
      .catch(error => res.status(404).json({error}));
}

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}

exports.modifySauce = (req, res, next) => { 
  // Récupère chemin image si renseigné
  const sauceObject = req.file ? { 
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
          // Supprime l'ancienne image pour ne pas encombrer le stockage
          let filename = ""
          if(req.file != undefined) {filename = sauce.imageUrl.split('/images/')[1]};
          fs.unlink(`images/${filename}`, () => {
            // Update la BDD
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => {res.status(200).json({message : 'Objet modifié!'})})
              .catch(error => res.status(401).json({ error }));})
        }
    })
    .catch(error => {res.status(400).json({error});
    });
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
        } else {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
        }
    })
    .catch(error => {res.status(500).json({error});});
  }

exports.likesauce = async (req, res, next) => {
  const commandLike = req.body.like; 
  try {
    await Sauce.findOne({ _id: req.params.id})
    console.log(commandLike);
    try {
      switch (commandLike) {
        case 1: 
        await Sauce.updateOne(
          {_id: req.params.id},
          {$push : {usersLiked: req.auth.userId},}
        )
        break;
        case 0: 
        await Sauce.updateOne(
          {_id: req.params.id},
          {$pull : {usersLiked: req.auth.userId, usersDisliked: req.auth.userId}}
          )
        break;
        case -1:
        await Sauce.updateOne(
          {_id: req.params.id},
          {$push : {usersDisliked: req.auth.userId},}
        )
    }
    const nouvelleSauce = await Sauce.findOne({ _id: req.params.id});
    const nouveauLikes = nouvelleSauce.usersLiked.length;
    const nouveauDislikes = nouvelleSauce.usersDisliked.length;
    await Sauce.updateOne(
      {_id: req.params.id},
      {likes: nouveauLikes,
      dislikes: nouveauDislikes}
    )
    res.status(200).json({message : 'Objet modifié!'})
    } catch(error){res.status(401).json({error})}
  } catch(error){res.status(500).json({error})}
}