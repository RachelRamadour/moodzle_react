import React, { useState } from "react";
import { Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSadCry,
  faSadTear,
  faMeh,
  faSmile,
  faGrinBeam,
} from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

function TodayScreen(props) {
  const [moodSelected, setMoodSelected] = useState();
  let tokenToBack = props.token;

  // Envoyer (ou modifier) la nouvelle mood du jour au Back

  const handleNewMood = async () => {
    try {
      const rawResult = await fetch("/save-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenToBack, moodSelected }),
      });
      const result = await rawResult.json();
      console.log("result", result);
      setMoodSelected(result);
    } catch (err) {
      console.log(err);
    }
  };

  const funFact = () => {
    if (!moodSelected) {
      return (
        <h2>
          <br />
          Bonjour {props.pseudo}, <br /> Comment te sens-tu aujourd'hui ?
        </h2>
      );
    } else if (moodSelected == 1 || moodSelected == 2) {
      return (
        <h2>
          <br />
          Oh non :-({" "}
        </h2>
      );
    } else if (moodSelected == 3) {
      return (
        <h2>
          <br />
          La journée n'est pas terminée !
        </h2>
      );
    } else if (moodSelected == 4 || moodSelected == 5) {
      return (
        <h2>
          <br />
          Youhouuuuu !!
        </h2>
      );
    } else {
      return (
        <h2>
          <br />
        </h2>
      );
    }
  };

  const link = () => {
    if (moodSelected) {
      return (
        <h2>
          Va donc jeter un coup d'oeil à tes{" "}
          <Link style={{ padding: 0 }} to="/year">
            stats !
          </Link>
        </h2>
      );
    }
  };

  if (props.token) {
    return (
      <div
        className="App"
        style={{
          backgroundColor: "#CEFFEB",
        }}
      >
        <NavBar />
        <Container>
          <div style={{ textAlign: "left" }}>
            <div contenteditable class="bubble bubble-bottom-left">
              {funFact()}
              {link()}
            </div>
            <img src="./images/moodz.png" className="moodz" alt="mascotte" />

            <div className="moodToSelect">
              <FontAwesomeIcon
                className="icon-today"
                icon={faSadCry}
                size="4x"
                style={{ color: "#CD6133", margin: 10 }}
                onClick={() => setMoodSelected(1)}
              />
              <FontAwesomeIcon
                className="icon-today"
                icon={faSadTear}
                size="4x"
                style={{ color: "#F0A07E", margin: 10 }}
                onClick={() => setMoodSelected(2)}
              />
              <FontAwesomeIcon
                className="icon-today"
                icon={faMeh}
                size="4x"
                style={{ color: "#F0D231", margin: 10 }}
                onClick={() => setMoodSelected(3)}
              />
              <FontAwesomeIcon
                className="icon-today"
                icon={faSmile}
                size="4x"
                style={{ color: "#44B79D", margin: 10 }}
                onClick={() => setMoodSelected(4)}
              />
              <FontAwesomeIcon
                className="icon-today"
                icon={faGrinBeam}
                size="4x"
                style={{ color: "#54857F", margin: 10 }}
                onClick={() => setMoodSelected(5)}
              />
              <FontAwesomeIcon
                className="icon-today-thumb"
                icon={faSave}
                size="4x"
                style={{ color: "#5b63ae", margin: 10 }}
                onClick={() => handleNewMood()}
              />
            </div>
          </div>
        </Container>
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

export default connect(mapStateToProps, null)(TodayScreen);
