import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { Line } from "react-chartjs-2";

import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";
import SelectButton from "./SelectButton";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setflag] = useState(false);

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

  // console.log(coin);

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
  
  
  const api1=axios.create({
    baseURL:'http://127.0.0.1:8000/SentimentAnalyzer/'
  }) 
  const createcourse=async()=>{
    try {
      let coin_data=await api1.post('/',{h:coin.id})
      console.log(coin_data.data)
     /*   Positive=coin_data.data.Positive
       Negative=coin_data.data.Negative
      Neutral=coin_data.data.Neutral
       Subjectivity=coin_data.data.Subjectivity */
       document.getElementById("pos").innerHTML=coin_data.data.Positive
       document.getElementById("negtve").innerHTML=coin_data.data.Negative
       document.getElementById("neut").innerHTML=coin_data.data.Neutral
       document.getElementById("Subjtv").innerHTML=coin_data.data.Subjectivity
       /* console.log(coin_data.data.Negative)  */
      /* setcoin(coin_data.data) */
    } catch (error) {
      console.log(error)
    }
   }



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
              


              <SelectButton onClick={() => createcourse()}>Sentiments</SelectButton>
              <SelectButton>hi</SelectButton>
              <SelectButton>hi</SelectButton>
              <SelectButton>hi</SelectButton>
            </div>
            
          </>
        )}
        <div class="sentiment" style={{display:"flex",flexDirection:"column",margin:20 ,justifyContent:"space-evenly", width:450,position:"relative",right:390}}>
              <h3>
              Positive: <span id="pos"></span></h3>
              <h3>
             Negative: <span id="negtve"></span></h3>
              <h3>
              Neutral: <span id="neut"></span></h3>
              <h3>
              Subjectivity: <span id="Subjtv"></span></h3>
            </div>
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
