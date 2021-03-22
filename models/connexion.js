//Connexion BDD
var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
}

var bdd = 'Moodzle_React'
var mdpbdd = 'capsule'
//     // --------------------- BDD -----------------------------------------------------
    mongoose.connect(`mongodb+srv://rach:${mdpbdd}@cluster0.box1d.mongodb.net/${bdd}?retryWrites=true&w=majority`,
    options,
    function(err) {
        if (err) {
            console.log('error', `failed to connect to the database because --> ${err}`);
        } else {
            console.info('* Connexion avec la base de données réussie *');
        }
    }
);