import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
  VictoryChart,
  VictoryPie,
} from "victory";
import { Redirect } from "react-router-dom";
import NavBar from "./NavBar";
import { CardImg, CardSubtitle, Card, CardTitle, CardText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSadCry,
  faSadTear,
  faMeh,
  faSmile,
  faGrinBeam,
} from "@fortawesome/free-solid-svg-icons";

function MonthScreen(props) {
  const [topActivities, setTopActivities] = useState(["", "", ""]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [pieData, setPieData] = useState([]);
  const [lineLabel, setLineLabel] = useState([""]);
  const [lineData, setLineData] = useState([0]);
  const [randomKey, setRandomKey] = useState(Math.random() * 1000);

  // Fonction qui vérifie si une année est bissextille
  function isLeapYear(year) {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  }

  useEffect(() => {
    if (props.token) {
      fetchData();
    }
    setRandomKey(Math.random() * 1000);
    // Enregistre les dates de départ et de fin pour le Calendrier
  }, [startDate]);

  // Fonction qui récupère les données du back + traite les données pour l'affichage sur les graphs
  var fetchData = async () => {
    var dataRaw = await fetch(`/history`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `startdate=${startDate}&type=month&token=${props.token}`,
    });

    var data = await dataRaw.json();
    var dataHistory = data.history;
    console.log("data", topActivities.length);

    // Top activités
    // Récupération du tableau d'activités
    var allMonthActivities = [];
    var eachMonthActivity = [];

    for (var i = 0; i < dataHistory.length; i++) {
      allMonthActivities.push(dataHistory[i].activity);
    }

    // Récupère les activités de chaque jour (certains ayant plusieurs activités)
    for (var j = 0; j < allMonthActivities.length; j++) {
      for (var i = 0; i < allMonthActivities[j].length; i++) {
        eachMonthActivity.push(allMonthActivities[j][i].name);
      }
    }

    // Traite pour compter le nombre d'occurences de chaque activité
    var map = eachMonthActivity.reduce(function (p, c) {
      p[c] = (p[c] || 0) + 1;
      return p;
    }, {});

    // Trie les activités par ordre décroissant d'occurence
    var topSortActivities = Object.keys(map).sort(function (a, b) {
      return map[b] - map[a];
    });

    // Boucle qui remplace les "undefined" des top activities en vide
    for (let i = 0; i < 3; i++) {
      if (topSortActivities[i] === undefined) {
        topSortActivities[i] = "";
      }
    }
    setTopActivities([
      topSortActivities[0],
      topSortActivities[1],
      topSortActivities[2],
    ]);

    // Line Chart
    // Traitement des données pour le Pie Chart
    pieDataGenerator(dataHistory);
    lineGenerator(dataHistory);
  };

  /* Fonction qui calcule le nombre d'occurence pour chaque score de mood */
  var pieDataGenerator = (dataset) => {
    // Initialisation des scores à 0 pour ensuite ajouter 1 à chaque occurence
    let score1 = 0;
    let score2 = 0;
    let score3 = 0;
    let score4 = 0;
    let score5 = 0;

    // Incrémenter les scores de 1 à chaque fois qu'une note des données correspond
    for (let i = 0; i < dataset.length; i++) {
      switch (dataset[i].mood_score) {
        case 1:
          score1 += 1;
          break;
        case 2:
          score2 += 1;
          break;
        case 3:
          score3 += 1;
          break;
        case 4:
          score4 += 1;
          break;
        case 5:
          score5 += 1;
          break;
      }
    }

    // Stocke les résultats dans un état pour les datas du PieChart
    setPieData([
      {
        x: 1,
        y: score1,
      },
      {
        x: 2,
        y: score2,
      },
      {
        x: 3,
        y: score3,
      },
      {
        x: 4,
        y: score4,
      },
      {
        x: 5,
        y: score5,
      },
    ]);
  };

  /* Fonction qui récupère les données pour la courbe */
  var lineGenerator = (dataset) => {
    let lineLabelsArray = [];
    let lineDataArray = [];
    var startDateFormat = new Date(startDate);
    var yearDate = startDateFormat.getFullYear();
    var monthDate = startDateFormat.getMonth();
    var bissextile = isLeapYear(yearDate);
    var firstSetDayNum = 1;
    var lastSetDayNum = 1;
    switch (monthDate) {
      case 0:
        lastSetDayNum = 31;
        break;
      case 1:
        // Vérifier si années bissextile (28j si oui, 29j sinon)
        bissextile ? (lastSetDayNum = 29) : (lastSetDayNum = 28);
        break;
      case 2:
        lastSetDayNum = 31;
        break;
      case 3:
        lastSetDayNum = 30;
        break;
      case 4:
        lastSetDayNum = 31;
        break;
      case 5:
        lastSetDayNum = 30;
        break;
      case 6:
        lastSetDayNum = 31;
        break;
      case 7:
        lastSetDayNum = 31;
        break;
      case 8:
        lastSetDayNum = 30;
        break;
      case 9:
        lastSetDayNum = 31;
        break;
      case 10:
        lastSetDayNum = 30;
        break;
      case 11:
        lastSetDayNum = 31;
        break;
    }

    for (let i = firstSetDayNum; i <= lastSetDayNum; i++) {
      i % 5 === 0 ? lineLabelsArray.push(`${i}`) : lineLabelsArray.push("");
    }

    // Filtre les dates doublons

    let unique = [];
    let uniqueDataset = [];
    dataset.forEach((element) => {
      if (
        !unique.includes(parseInt(element.date.substring(8, 10))) &&
        monthDate + 1 === parseInt(element.date.substring(5, 7))
      ) {
        unique.push(parseInt(element.date.substring(8, 10)));
        uniqueDataset.push(element);
      }
    });

    var uniqueDataSetLength = uniqueDataset.length;
    var j = 0;
    for (let i = 0; i < lineLabelsArray.length; i++) {
      if (j >= uniqueDataSetLength) {
        lineDataArray.push(0);
        continue;
      } else if (i + 1 === parseInt(uniqueDataset[j].date.substring(8, 10))) {
        lineDataArray.push(parseInt(uniqueDataset[j].mood_score));
        j += 1;
      } else {
        lineDataArray.push(0);
      }
    }
    // Génère les labels
    // Puis les data
    setLineLabel(lineLabelsArray);
    setLineData(lineDataArray);
  };

  // Crée tableau de données avec jours (labels) en x et moods en y
  var table = [];
  for (var i = 0; i < lineLabel.length; i++) {
    table.push({ x: i, y: lineData[i] });
  }

  const activities = () => {
    if (topActivities[0]) {
      return (
        <div className="divPPodium">
          <CardSubtitle className="pPodium" style={{ color: "#5B63AE" }}>
            {topActivities[0]}
          </CardSubtitle>
          <CardSubtitle className="pPodium" style={{ color: "#44B79D" }}>
            {" "}
            {topActivities[1]}
          </CardSubtitle>
          <CardSubtitle className="pPodium" style={{ color: "#DF8F4A" }}>
            {topActivities[2]}
          </CardSubtitle>
        </div>
      );
    } else {
      return (
        <div className="divPPodium" style={{ maxWidth: "40%" }}>
          <CardSubtitle
            className="pPodium"
            style={{ color: "#5B63AE", fontSize: 10 }}
          >
            Aucune activité enregistrée ce mois-ci. <br />
            <br />
            Pense à télécharger notre appli pour y remédier!
          </CardSubtitle>
        </div>
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

        <h1>Les moodz mensuels</h1>

        <Card className="card">
          <CardTitle className="cardTitle">Tes 3 activités préférées</CardTitle>
          {activities()}

          <CardImg
            src="./images/podium-moodzle.png"
            className="podium"
            alt="mascotte paresseux accoudée sur un podium"
          />
        </Card>

        <Card className="card">
          <CardTitle className="cardTitle">Variation de tes humeurs</CardTitle>

          <VictoryChart
            className="chart" // theme={VictoryTheme.material}
          >
            <VictoryLine
              style={{
                data: {
                  stroke: "#F0A07E",
                  strokeWidth: 1,
                  strokeLinecap: "round",
                },
                labels: {
                  fontSize: 0,
                  fill: ({ datum }) => (datum.x === 3 ? "#000000" : "#c43a31"),
                },
                parent: { border: "1px solid #ccc" },
              }}
              activateData={false}
              activateLabels={false}
              data={table}
            />

            <VictoryAxis
              style={{
                axis: { stroke: "transparent" },
                ticks: { stroke: "transparent" },
                tickLabels: { fill: "#F0A07E" },
              }}
            />
          </VictoryChart>
        </Card>

        <Card className="card">
          <CardTitle className="cardTitle">
            Répartition de tes humeurs
          </CardTitle>

          <VictoryChart className="chart">
            <VictoryPie
              cornerRadius={({ datum }) => datum.y * 5}
              data={pieData}
              colorScale={[
                "#CD6133",
                "#F0A07E",
                "#F0D231",
                "#44B79D",
                "#54857F",
              ]}
              labelComponent={
                <VictoryLabel style={{ fill: "transparent" }} angle={45} />
              }
            />

            <VictoryAxis
              style={{
                axis: { stroke: "transparent" },
                ticks: { stroke: "transparent" },
                tickLabels: { fill: "transparent" },
              }}
            />
          </VictoryChart>

          <CardText>
            <FontAwesomeIcon
              className="icon-today"
              icon={faSadCry}
              size="2x"
              style={{ color: "#CD6133", margin: 2 }}
            />
            <FontAwesomeIcon
              className="icon-today"
              icon={faSadTear}
              size="2x"
              style={{ color: "#F0A07E", margin: 2 }}
            />
            <FontAwesomeIcon
              className="icon-today"
              icon={faMeh}
              size="2x"
              style={{ color: "#F0D231", margin: 2 }}
            />
            <FontAwesomeIcon
              className="icon-today"
              icon={faSmile}
              size="2x"
              style={{ color: "#44B79D", margin: 2 }}
            />
            <FontAwesomeIcon
              className="icon-today"
              icon={faGrinBeam}
              size="2x"
              style={{ color: "#54857F", margin: 2 }}
            />
          </CardText>
        </Card>
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

export default connect(mapStateToProps, null)(MonthScreen);
