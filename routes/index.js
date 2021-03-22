var express = require("express");
var router = express.Router();
var moodModel = require("../models/moods");
var activityModel = require("../models/activities");
var userModel = require("../models/users");
var mongoose = require("mongoose");
var uid2 = require("uid2");
var bcrypt = require("bcrypt");

// Nombre de caractères du mot de passe chiffré
const cost = 10;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//////// HOME SCREEN ////////

// Sign-up
router.post("/sign-up", async function (req, res, next) {
  var result = false;
  var token = null;
  console.log(req.body.username, req.body.email, req.body.password);
  const hash = bcrypt.hashSync(req.body.password, cost);

  // Vérification si l'utilisateur n'existe pas déjà.
  // Si non et que les conditions sont respectées, on enregistre,
  // on crée un token et on chiffre le mot de passe
  const data = await userModel.findOne({
    username: req.body.username,
    email: req.body.email,
  });
  if (
    data === null &&
    req.body.username.length > 0 &&
    req.body.email.length > 8 &&
    req.body.password.length > 3
  ) {
    var newUser = new userModel({
      username: req.body.username,
      token: uid2(32),
      email: req.body.email,
      password: hash,
    });
    var saveUser = await newUser.save();
    if (saveUser) {
      result = true;
      token = saveUser.token;
    }
  }
  if (result == true) {
    res.json({ result, saveUser, token });
  } else {
    res.json({ result });
  }
});

// Sign-In
router.post("/sign-in", async function (req, res, next) {
  var result = false;
  var token = null;

  // Vérification si existe dans la BDD
  try {
    const data = await userModel.findOne({
      email: req.body.email,
    });
    console.log("token", data.token);
    const passwordCheck = bcrypt.compareSync(req.body.password, data.password);
    if (passwordCheck) {
      res.json({
        result: true,
        msg: "connexion réussie",
        username: data.username,
        token: data.token,
      });
    } else {
      res.json({
        result: false,
        msg: "erreur login",
        err: "le mot de passe est incorrect",
      });
    }
  } catch (err) {
    res.json({ result: false, msg: "erreur login", err: err.message });
  }
});

//////// MOOD SCREEN ////////

// Enregistrement d'un mood (mood score, activité & date)
router.post("/save-mood", async (req, res, next) => {
  // Vérifier si déjà mood enregistré ce jour. SI oui, update, sinon, enregistre

  //const dates d'aujourd'hui
  const dateNow = new Date();
  const dayNow = dateNow.getDate();
  const monthNow = dateNow.getMonth();
  const yearNow = dateNow.getFullYear();

  const token = req.body.tokenToBack;
  const mood = req.body.moodSelected;

  const user = await userModel
    .findOne({ token })
    .populate({ path: "history", populate: { path: "activity" } })
    .exec();

  //Filtre sur l'historique de l'utilisateur afin de vérifier l'existence d'un mood enregistré ce-jour
  const filteredHistory = user.history.filter(
    (mood) =>
      new Date(
        mood.date.getFullYear(),
        mood.date.getMonth(),
        mood.date.getDate() + 1
      ) >= new Date(yearNow, monthNow, dayNow + 1)
  );

  // Si mood du jour inexistant, on push
  if (filteredHistory.length == 0) {
    // enregistrement du mood en bdd :
    const newMood = new moodModel({
      date: new Date(),
      mood_score: mood,
    });
    const savedMood = await newMood.save();
    // on récupère l'id du mood créé pour pusher dans l'history du user:
    const moodId = savedMood._id;

    // on update le user en ajoutant l'id du mood/activités :
    const updateUser = await userModel.updateOne(
      { token },
      { $push: { history: moodId } }
    );
    const moodFromBack = savedMood.mood_score;
    res.json({
      msg: `mood ${moodId} créé avec succès pour l'utilisateur ${token}`,
      updateUser,
      moodFromBack,
    });
  } else {
    // Si mood existant pour ce jour, on update
    const existingMoodId = filteredHistory[0]._id;

    const updatingMood = await moodModel.updateOne(
      { _id: existingMoodId },
      { date: new Date(), mood_score: mood }
    );

    res.json({
      msg: `mood ${existingMoodId} mis à jour avec succès pour l'utilisateur ${token}`,
      updatingMood,
    });
  }
});

//////// CHARTS SCREEN ////////

router.post("/history", async function (req, res, next) {
  var result = false;
  var date = new Date(req.body.startdate);
  var filterType = req.body.type;

  const token = req.body.token;

  // Le choix de la page de charts (week/month/year) détermine la requête
  switch (filterType) {
    case "month":
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
        1
      ).toISOString();
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1,
        1
      ).toISOString();
      break;
    case "week":
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() + 1,
        1
      ).toISOString();
      var lastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() + 7,
        1
      ).toISOString();
      break;
    case "year":
      var firstDay = new Date(date.getFullYear(), 0, 1, 1).toISOString();
      var lastDay = new Date(date.getFullYear(), 11, 31, 1).toISOString();
      break;
    default:
      var firstDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() - date.getDay() - 7,
        1
      ).toISOString();
      var lastDay = date.toLocaleDateString(undefined);
      break;
  }

  // puis on cherche dans l'historique en fonction de la date de début et la date de fin
  var moodsHistory = await userModel
    .findOne({ token: req.body.token })
    .populate({
      path: "history",
      match: { date: { $gte: firstDay, $lte: lastDay } },
      populate: { path: "activity" },
    })
    .exec();

  // console.log('mood', moodsHistory)
  res.json(moodsHistory);
});

//////// SETTINGS SCREEN ////////

router.put("/modifications", async (req, res) => {
  try {
    var usernameModified = req.body.username;
    var user = await userModel.findOne({ token: req.body.token });
    // console.log("usernameBDD", user.username, 'newUsername', usernameModified);
    // Récupération des values de l'input pour modifier le mdp
    var actualPasswordFromFront = req.body.actualPassword;
    var newPassword = req.body.newPassword;
    var confirmedPassword = req.body.confirmedPassword;
    var newPasswordCrypted = bcrypt.hashSync(newPassword, cost);
    console.log(
      "actualPsw",
      actualPasswordFromFront,
      "newpwd",
      newPassword,
      "confirmed",
      confirmedPassword
    );

    //compare mot de passe envoyé et mot de passe de bdd
    const passwordCheck = bcrypt.compareSync(
      actualPasswordFromFront,
      user.password
    );

    // Mise à jour de la base de données (username ou password)
    if (user.username != usernameModified) {
      await userModel.updateOne(
        { token: req.body.token },
        { username: usernameModified }
      );
    } else if (passwordCheck && newPassword == confirmedPassword) {
      await userModel.updateOne(
        { token: req.body.token },
        { password: newPasswordCrypted }
      );

      console.log("user", user.password);
      console.log("pseudo", newPasswordCrypted);
    }

    res.json({ usernameModified, userPassword: user.password });
  } catch (err) {
    console.log("check2", user.username, "new", usernameModified);

    res.json(err);
  }
});

////////////////// FONCTIONS HELPER ET ROUTES TEST

// Fonction pour récupérer les id des activités en base de données (utilisée dans la route 'save-mood')
async function getAllId(activity) {
  try {
    let idTab = [];
    for (var i = 0; i < activity.length; i++) {
      let activityFromMongo = await activityModel.findOne({
        name: activity[i].name,
        category: activity[i].category,
      });
      let id = activityFromMongo._id;
      idTab.push(id);
    }
    return idTab;
  } catch (err) {
    console.log(err);
    return err;
  }
}

//////////////////  PROCEDURE INITIALE POUR REMPLIR LA BASE DE DONNEES AVEC UTILISATEUR TEST

// Pour génération du user test
const activityList = [
  { category: "sport", name: "Rugby" },
  { category: "social", name: "Apéro" },
  { category: "culture", name: "Expo" },
  { category: "culture", name: "Ukulélé" },
  { category: "sport", name: "Voile" },
];

// Route pour générer des activités
router.get("/generate-activity", async function (req, res, next) {
  for (var i = 0; i < activityList.length; i++) {
    var newActivity = new activityModel({
      _id: new mongoose.Types.ObjectId(),
      name: activityList[i].name,
      category: activityList[i].category,
    });

    var activitySave = await newActivity.save();
  }
  res.render("index", { title: "Express" });
});

// Route pour générer les données
router.get("/generate-data", async function (req, res, next) {
  var moodListID = [];

  var startDate = new Date("2021-01-01");
  var now = new Date();

  // Générer les historiques avec un score aléatoire (allant de 1 à 5)
  for (var i = startDate; i < now; i.setDate(i.getDate() + 1)) {
    var activityIDList = [];
    var rndActivityCt = Math.floor(Math.random() * Math.floor(2)) + 1;

    for (var j = 0; j < rndActivityCt; j++) {
      var activityName =
        activityList[Math.round(Math.random() * Math.floor(4))].name;
      var activityFind = await activityModel.findOne({ name: activityName });
      activityIDList.push(activityFind._id);
    }

    // Ajout des moods score entre
    var newMood = new moodModel({
      _id: new mongoose.Types.ObjectId(),
      date: new Date(i),
      mood_score: Math.round(Math.random() * Math.floor(4)) + 1,
    });

    newMood.activity = activityIDList;

    moodListID.push(newMood._id);

    var moodSave = await newMood.save();
  }

  var newUser = new userModel({
    username: "Shakur",
    token: uid2(32),
    email: "rramadour@gmail.com",
    history: moodListID,
    password: "$2b$10$/2RR5.VsDYzu64FAb1EOi.WLZd5ZQt6bh/AuaTbZdq8GKDRTCrzAa",
  });

  var userSave = await newUser.save();

  res.render("index", { title: "Express" });
});

module.exports = router;
