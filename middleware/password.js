const passwordValidator = require('password-validator');
const passwordBlacklist = require('./passwordBlacklist');
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(1)                                // Must have at least 2 digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(passwordBlacklist);         // Blacklist these values 
// Source Blacklist : https://www.ncsc.gov.uk/static-assets/documents/PwnedPasswordsTop100k.json puis passé dans le test ci-dessus

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next()
    }else{
        return res.status(400).json({message: `Le mot de passe est trop faible: ${
            passwordSchema.validate('req.body.password', { list: true })
        }`})
    }
}
