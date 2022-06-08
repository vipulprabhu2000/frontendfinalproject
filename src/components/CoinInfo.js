import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import {
  Box,
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";

ChartJS.register(ArcElement, Tooltip, Legend);
const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setflag] = useState(false);
  const [coins, setCoins] = useState([]);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setflag(true);
    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });
  const api1 = axios.create({
    baseURL: "http://127.0.0.1:8000/SentimentAnalyzer/",
  });

  const createcourse = async () => {
    try {
      let coin_data = await api1.post("/", { h: coin.id });

      setCoins([
        coin_data.data.Positive,
        coin_data.data.Negative,
        coin_data.data.Neutral,
        coin_data.data.Subjectivity,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  var data = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "# of Votes",
        data: [coins[0], coins[1], coins[2]],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicData | (flag === false) ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            {/* <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            /> */}
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <SelectButton onClick={createcourse}>Sentiments</SelectButton>
            </div>
          </>
        )}
        <div
          class="sentiment"
          style={{
            display: "flex",
            flexDirection: "column",
            margin: 20,
            justifyContent: "space-evenly",
            width: 450,
            position: "relative",
            right: 390,
          }}
        >
          <h3>Positive:{coins[0]}</h3>
          <h3>Negative: {coins[1]}</h3>
          <h3>Neutral: {coins[2]}</h3>
          <h3>Subjectivity: {coins[3]}</h3>
        </div>

        <Box component="div" m={1} style={{ width: "700", height: "700" }}>
          <Doughnut data={data} />
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
