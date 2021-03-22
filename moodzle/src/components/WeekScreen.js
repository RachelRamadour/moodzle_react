import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardText } from "reactstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  VictoryPie,
  VictoryLabel,
  VictoryAxis,
  VictoryLine,
  VictoryChart,
} from "victory";
import NavBar from "./NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSadCry,
  faSadTear,
  faMeh,
  faSmile,
  faGrinBeam,
} from "@fortawesome/free-solid-svg-icons";

function WeekScreen(props) {
  const [dataChart, setDataChart] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [pieData, setPieData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  /* Hook d'effet à l'ouverture de la page pour charger les données*/
  useEffect(() => {
    if (props.token) {
      fetchData();
    }
  }, [startDate]);

  //Récupération du résultat renvoyé par le backend
  var fetchData = async () => {
    var rawDatas = await fetch(`/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `startdate=${startDate}&type=week&token=${props.token}`,
    });

    var datas = await rawDatas.json();
    var dataHistory = datas.history;
    console.log("data", dataHistory);
    var setterdataChart = [];
    for (var i = 0; i < 7; i++) {
      if (
        dataHistory[i] === undefined ||
        dataHistory[i].mood_score === undefined
      ) {
        setterdataChart.push(1);
      } else {
        setterdataChart.push(parseInt(dataHistory[i].mood_score));
      }
    }
    setDataChart(setterdataChart);

    // Traitement des données pour le Pie Chart
    pieDataGenerator(dataHistory);
  };

  var day = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  var table = [];

  for (var i = 0; i < 7; i++) {
    table.push({ x: day[i], y: dataChart[i] });
  }

  /* Fonction qui calcule le nombre d'occurence pour chaque score de mood */
  var pieDataGenerator = (dataset) => {
    // Initialisation des scores à 0
    let score1 = 0;
    let score2 = 0;
    let score3 = 0;
    let score4 = 0;
    let score5 = 0;

    // Incrémenter les scores de 1 à chaque fois qu'une note des données correspondent
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

    // Stocker les résultats dans un états qui seront exploiter par le PieChart
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

  if (props.token) {
    return (
      <div
        className="App"
        style={{
          backgroundColor: "#CEFFEB",
        }}
      >
        <NavBar />

        <h1>Les moodz hebdos</h1>

        <Card className="card">
          <CardTitle className="cardTitle">Variation de tes humeurs</CardTitle>

          <VictoryChart margin={5}>
            <VictoryLine
              className="chart"
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
                tickLabels: { fill: "#57706D" },
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

export default connect(mapStateToProps, null)(WeekScreen);
