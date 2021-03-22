import React, { useState } from "react";
import { Input, Button } from "antd";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

function HomeScreen(props) {
  const [pseudo, setPseudo] = useState("");
  const [emailSI, setEmailSI] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordSI, setPasswordSI] = useState("");

  //Fonction de création d'un utilisateur en BDD si pas encore existant
  var handleSubmitSignUp = async () => {
    try {
      console.log(pseudo, email, password);
      let data = await fetch("/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${pseudo}&email=${email}&password=${password}`,
      });
      let body = await data.json();
      let newToken = body.token;
      let newPseudo = body.saveUser.username;

      if (body.result === true) {
        // Ajout de l'utilisateur au store :
        props.addToken(newToken);
        props.onSubmitPseudo(newPseudo);
      }
    } catch (err) {
      alert(
        "Cet utilisateur existe déjà! veuillez utiliser une autre adresse ou un pseudo différent."
      );
      console.log("something went wrong with sign-up process");
    }
  };

  //Fonction de connexion pour utilisateur déjà existant en BDD
  var handleSubmitSignIn = async () => {
    try {
      const data = await fetch("/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `email=${emailSI}&password=${passwordSI}`,
      });
      const body = await data.json();
      // console.log("result", body.result, "name", body.username);

      //Traitement en fonction du resultat de la reqûete : true -> connexion / false -> rien ne se passe (gestion & affichage des erreurs par la suite...)
      if (body.result === true) {
        const receivedPseudo = body.username;
        const receivedToken = body.token;
        // Ajout de l'utilisateur au store :
        props.addToken(receivedToken);
        props.onSubmitPseudo(receivedPseudo);
      } else {
        alert(
          "Cet utilisateur n'existe pas! Adresse ou mot de passe incorrect. Si vous n'avez pas de compte veuillez en créer un."
        );
      }
    } catch (err) {
      console.log("something went wrong with sign-in process");
    }
  };

  // Si l'utilisateur n'est pas connecté, on le renvoie vers la Home, sinon, vers son interface personnelle
  if (!props.token) {
    return (
      <div className="App">
        <img
          src="./images/moodz_logo.png"
          className="logo"
          alt="mascotte paresseux sur un podium"
        />
        <div xs="auto" className="Login-page">
          {/* CONNEXION */}

          <div className="Sign ">
            <Input
              className="Login-input"
              placeholder="email"
              onChange={(g) => setEmailSI(g.target.value)}
              value={emailSI}
            />

            <Input.Password
              className="Login-input"
              placeholder="password"
              onChange={(e) => setPasswordSI(e.target.value)}
              value={passwordSI}
            />

            <Button
              className="button"
              type="primary"
              onClick={() => handleSubmitSignIn()}
            >
              Se connecter
            </Button>
          </div>

          {/* INNSCRIPTION */}

          <div className="Sign">
            <Input
              className="Login-input"
              placeholder="pseudo"
              onChange={(g) => setPseudo(g.target.value)}
              value={pseudo}
            />

            <Input
              className="Login-input"
              placeholder="email"
              onChange={(g) => setEmail(g.target.value)}
              value={email}
            />

            <Input.Password
              className="Login-input"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <Button
              className="button"
              type="primary"
              onClick={() => handleSubmitSignUp()}
            >
              S'inscrire
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/today" />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmitPseudo: function (pseudo) {
      dispatch({ type: "savePseudo", pseudo: pseudo });
    },
    addToken: function (token) {
      dispatch({ type: "addToken", token: token });
    },
  };
}

function mapStateToProps(state) {
  return {
    pseudo: state.pseudo,
    token: state.token,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
