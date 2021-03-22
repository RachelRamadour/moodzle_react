import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSadCry,
  faSadTear,
  faMeh,
  faSmile,
  faGrinBeam,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import NavBar from "./NavBar";

function ChartsYearScreen(props) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [dataDisplay, setDataDisplay] = useState([]);
  const [yearDisplay, setYearDisplay] = useState(new Date().getFullYear());

  useEffect(() => {
    // Récupère l'année de la date actuelle
    var yearDate = new Date(startDate);

    // Variable boolean qui va être True si l'année est bissextile
    var checkLeap = isLeapYear(yearDate.getFullYear());
    // initiateArray génère des tables avec des icones grises et prend pour un argument un true/false pour vérifier s'il s'agit d'une année bissextile
    initiateArray(checkLeap);

    // Récupère les données de la BDD + génère les tables pour l'affichage du calendrier
    if (props.token) {
      fetchData();
    }
  }, [startDate]);

  // Initialise des tables pour chaque mois avec l'entête en élément à l'index 0
  var jan = ["J"];
  var feb = ["F"];
  var mar = ["M"];
  var apr = ["A"];
  var may = ["M"];
  var jun = ["J"];
  var jul = ["J"];
  var aug = ["A"];
  var sep = ["S"];
  var oct = ["O"];
  var nov = ["N"];
  var dec = ["D"];

  /*  initiateArray : initialise des 12 Tables (une par mois) avec un cercle gris par jour 
      Prend en variable un Boolean qui est True si l'année en cours est bissextile*/
  const initiateArray = (bissextile) => {
    // Boucle for sur les 12 mois de l'année
    for (let i = 0; i < 12; i++) {
      /* 
        Condition sur l'index qui correspond au mois (l'index 0 correspond au mois de Janvier)
        Ajoute une icone FontAwesome pour chaque jour du mois   
        Enregistre le résultat dans les variables de mois correspondantes 
      */
      var emptyIcon = (
        <FontAwesomeIcon
          icon={faCircle}
          size="1x"
          style={{ color: "rgba(28, 160, 129, 0.3)" }}
        />
      );

      switch (i) {
        case 0:
          for (let j = 0; j < 31; j++) {
            jan.push(emptyIcon);
          }
          break;
        case 1:
          // Vérifier si années bissextile (28j si oui, 29j sinon)
          var febDay = 29;
          bissextile ? (febDay = 28) : (febDay = 29);
          for (let j = 0; j < febDay; j++) {
            feb.push(emptyIcon);
          }
          break;
        case 2:
          for (let j = 0; j < 31; j++) {
            mar.push(emptyIcon);
          }
          break;
        case 3:
          for (let j = 0; j < 30; j++) {
            apr.push(emptyIcon);
          }
          break;
        case 4:
          for (let j = 0; j < 31; j++) {
            may.push(emptyIcon);
          }
          break;
        case 5:
          for (let j = 0; j < 30; j++) {
            jun.push(emptyIcon);
          }
          break;
        case 6:
          for (let j = 0; j < 31; j++) {
            jul.push(emptyIcon);
          }
          break;
        case 7:
          for (let j = 0; j < 31; j++) {
            aug.push(emptyIcon);
          }
          break;
        case 8:
          for (let j = 0; j < 30; j++) {
            sep.push(emptyIcon);
          }
          break;
        case 9:
          for (let j = 0; j < 31; j++) {
            oct.push(emptyIcon);
          }
          break;
        case 10:
          for (let j = 0; j < 30; j++) {
            nov.push(emptyIcon);
          }
          break;
        case 11:
          for (let j = 0; j < 31; j++) {
            dec.push(emptyIcon);
          }
          break;
      }
    }
  };

  // Fonction qui vérifie si une année est bissextille
  function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }

  //Fonction qui récupère du résultat renvoyé par le backend et les exploite pour obtenir les bonnes données finales
  var fetchData = async () => {
    var rawData = await fetch(`/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `startdate=${startDate}&type=year&token=${props.token}`,
    });

    var data = await rawData.json();
    var dataHistory = data.history; // Variable qui contient les données de l'historique

    // Boucle sur l'historique pour remplacer les points gris par les points de couleurs (qui varient en fonction du mood_score)
    for (var i = 0; i < dataHistory.length; i++) {
      var convertDate = new Date(dataHistory[i].date); // Reconverti la date de l'historique
      var month = parseInt(convertDate.getMonth()); // Récupère le mois
      var day = parseInt(convertDate.getDate()); // Récupère le jour
      var moodScore = parseInt(dataHistory[i].mood_score); // Récupère le mood score

      // Fonction qui prend en variable le score et qui retourne un cercle avec la couleur associée à la note
      const moodScoreCircle = (score) => {
        switch (score) {
          case 1:
            return (
              <FontAwesomeIcon
                icon={faSadCry}
                size="1x"
                style={{ color: "#CD6133" }}
              />
            );
          case 2:
            return (
              <FontAwesomeIcon
                icon={faSadTear}
                size="1x"
                style={{ color: "#F0A07E" }}
              />
            );
          case 3:
            return (
              <FontAwesomeIcon
                icon={faMeh}
                size="1x"
                style={{ color: "#F0D231" }}
              />
            );
          case 4:
            return (
              <FontAwesomeIcon
                icon={faSmile}
                size="1x"
                style={{ color: "#44B79D" }}
              />
            );
          case 5:
            return (
              <FontAwesomeIcon
                icon={faGrinBeam}
                size="1x"
                style={{ color: "#54857F" }}
              />
            );
        }
      };

      /* Condition sur le mois (getMonth initialise janvier à 0)
        Modifie la Table correspondante au mois et remplace le jour avec un Mood enregistré par une icone colorée
        moodScoreCircle retourne une icône fontAwesome avec une couleur différente en fonction du score
      */
      switch (month) {
        case 0:
          jan[day] = moodScoreCircle(moodScore);
          break;
        case 1:
          feb[day] = moodScoreCircle(moodScore);
          break;
        case 2:
          mar[day] = moodScoreCircle(moodScore);
          break;
        case 3:
          apr[day] = moodScoreCircle(moodScore);
          break;
        case 4:
          may[day] = moodScoreCircle(moodScore);
          break;
        case 5:
          jun[day] = moodScoreCircle(moodScore);
          break;
        case 6:
          jul[day] = moodScoreCircle(moodScore);
          break;
        case 7:
          aug[day] = moodScoreCircle(moodScore);
          break;
        case 8:
          sep[day] = moodScoreCircle(moodScore);
          break;
        case 9:
          oct[day] = moodScoreCircle(moodScore);
          break;
        case 10:
          nov[day] = moodScoreCircle(moodScore);
          break;
        case 11:
          dec[day] = moodScoreCircle(moodScore);
          break;
      }
    }

    //   // Modifie la variable d'état dataDisplay qui récupère tous les tableaux concernés
    setDataDisplay([
      jan,
      feb,
      mar,
      apr,
      may,
      jun,
      jul,
      aug,
      sep,
      oct,
      nov,
      dec,
    ]);
  };

  //   // Table qui contient les numéros des jours

  var tableDay = [];
  for (var i = 1; i < 32; i++) {
    tableDay.push(<Col className="circle">{i}</Col>);
  }
  // Premier index vide pour pouvoir laisser la première cellule du tableau vide

  tableDay.unshift(<Col style={{ color: "transparent" }}> '' </Col>);
  if (props.token) {
    return (
      <div className="App">
        <NavBar />

        <h1 style={{ margin: 0 }}>Ton Moodzle {yearDisplay}</h1>

        <Card
          className="card"
          style={{ width: 300, marginBottom: "1%", padding: 5 }}
        >
          <Row className="calendar">
            <Col className="circleDay">{tableDay}</Col>

            <Col className="Col">{dataDisplay[0]}</Col>
            <Col className="Col">{dataDisplay[1]}</Col>
            <Col className="Col">{dataDisplay[2]}</Col>
            <Col className="Col">{dataDisplay[3]}</Col>
            <Col className="Col">{dataDisplay[4]}</Col>
            <Col className="Col">{dataDisplay[5]}</Col>
            <Col className="Col">{dataDisplay[6]}</Col>
            <Col className="Col">{dataDisplay[7]}</Col>
            <Col className="Col">{dataDisplay[8]}</Col>
            <Col className="Col">{dataDisplay[9]}</Col>
            <Col className="Col">{dataDisplay[10]}</Col>
            <Col className="Col">{dataDisplay[11]}</Col>
          </Row>
        </Card>
      </div>
    );
  } else {
    return <Redirect to="/" />;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeStep: (newstep) => {
      dispatch({ type: "change-step", newstep: newstep });
    },
  };
};

const mapStateToProps = (state) => {
  return {
    mood: state.mood,
    step: state.step,
    pseudo: state.pseudo,
    token: state.token,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartsYearScreen);
