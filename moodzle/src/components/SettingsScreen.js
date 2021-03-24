import React, { useState } from "react";
import Navbar from "./NavBar";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Modal, Button, Input } from "antd";

function SettingsScreen(props) {
  const [overlayModifyPseudo, setOverlayModifyPseudo] = useState(false);
  const [overlayModifyPassword, setOverlayModifyPassword] = useState(false);
  const [pseudoModified, setPseudoModified] = useState(props.pseudo);
  const [actualPassword, setActualPassword] = useState("");
  const [passwordModified, setPasswordModified] = useState("");
  const [confirmPasswordModified, setConfirmPasswordModified] = useState("");

  // Envoi les infos à modifier (et vérifier pour confirmer la modif) au Back
  var fetchData = async () =>
    await fetch("/modifications", {
      method: "PUT",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${pseudoModified}&actualPassword=${actualPassword}&newPassword=${passwordModified}&confirmedPassword=${confirmPasswordModified}&token=${props.token}`,
    });

  // Modification pseudo
  const toggleOverlayPseudo = () => {
    console.log("coucou");
    setOverlayModifyPseudo(!overlayModifyPseudo);
  };

  const handlePseudoOk = () => {
    props.modifyPseudo(pseudoModified);
    setOverlayModifyPseudo(false);
    fetchData();
  };

  const handlePseudoCancel = () => {
    setOverlayModifyPseudo(false);
  };

  // Modification pseudo
  const toggleOverlayPassword = () => {
    console.log("coucou passw");
    setOverlayModifyPassword(!overlayModifyPassword);
  };

  const handlePasswordOk = () => {
    setOverlayModifyPassword(false);
    fetchData();
  };

  const handlePasswordCancel = () => {
    setOverlayModifyPassword(false);
  };

  if (props.token) {
    return (
      <div>
        <Navbar />
        <img
          src="./images/MoodScreen.png"
          className="moodzLiane"
          alt="mascotte paresseux tête à l'envers"
        />

        <div
          className="App"
          style={{
            backgroundColor: "#CEFFEB",
          }}
        >
          <div
            className="Sign"
            style={{
              minWidth: 300,
              minHeight: 300,
              color: "white",
              marginTop: 15,
            }}
          >
            <h1 style={{ color: "#5b63ae" }}>Ton profil</h1>
            <p className="profil">pseudo : {props.pseudo}</p>
            <Button onClick={() => toggleOverlayPseudo()}> Modifier</Button>

            <Modal
              title="Modification du pseudo"
              visible={overlayModifyPseudo}
              onOk={handlePseudoOk}
              onCancel={handlePseudoCancel}
            >
              <Input
                className="Login-input"
                editable
                placeholder="username"
                onChange={(p) => setPseudoModified(p.target.value)}
                value={pseudoModified}
              />
            </Modal>

            <p className="profil">mot de passe : ******</p>
            <Button onClick={() => toggleOverlayPassword()}> Modifier</Button>

            <Modal
              title="Modification du mot de passe"
              visible={overlayModifyPassword}
              onOk={handlePasswordOk}
              onCancel={handlePasswordCancel}
            >
              <Input
                className="Login-input"
                editable
                type="password"
                placeholder="actuel mot de passe"
                onChange={(pwd) => setActualPassword(pwd.target.value)}
                value={actualPassword}
              />
              <Input
                className="Login-input"
                editable
                type="password"
                placeholder="nouveau mot de passe"
                onChange={(pwd) => setPasswordModified(pwd.target.value)}
                value={passwordModified}
              />
              <Input
                className="Login-input"
                editable
                type="password"
                placeholder="confirmation du nouveau mot de passe"
                onChange={(pwd) => setConfirmPasswordModified(pwd.target.value)}
                value={confirmPasswordModified}
              />
            </Modal>
          </div>
        </div>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

const mapStateToProps = (state) => {
  return {
    pseudo: state.pseudo,
    token: state.token,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    modifyPseudo: (newPseudo) => {
      dispatch({ type: "modify-pseudo", newPseudo });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
