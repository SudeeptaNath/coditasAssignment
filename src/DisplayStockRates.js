import { useEffect, useState, useRef, Fragment } from "react";
import DisplayTable from "./DisplayTable";
import classes from "./styles.module.css";
const DisplayStockRates = () => {
  const [stockArray, setStockArray] = useState([]);

  const [currentTime, setLatestTime] = useState();
  const [latestUSD, setLatestUSD] = useState(null);
  const [latestGBP, setLatestGBP] = useState(null);
  const [latestEUR, setLatestEUR] = useState(null);

  const [riseInUSD, setRiseInUSD] = useState(false);
  const [riseInGBP, setRiseInGBP] = useState(false);
  const [riseInEUR, setRiseInEUR] = useState(false);

  //to remember previous rates
  const prevRateUSD = useRef(null);
  const prevRateEUR = useRef(null);
  const prevRateGBP = useRef(null);

  
  useEffect(() => {
    setInterval(() => {
      getLatestStocks();
    }, 60000);

    async function getLatestStocks() {
      var fetchStockDetails = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice.json"
      );
      var fetchedDetails = await fetchStockDetails.json();
      updateLatestDetails(fetchedDetails);
      fetchedDetails = { ...fetchedDetails, riseInUSD, riseInGBP, riseInEUR };
      setStockArray([...stockArray, fetchedDetails]);
    }

    function updateLatestDetails(fetchedDetails) {
      setLatestTime(fetchedDetails.time);
      setLatestUSD(fetchedDetails.bpi.USD.rate);
      setLatestGBP(fetchedDetails.bpi.GBP.rate);
      setLatestEUR(fetchedDetails.bpi.EUR.rate);
      console.log("fetchedDetails");
      console.log(fetchedDetails);

      compareRates(prevRateUSD.current,fetchedDetails.bpi.USD.rate,setRiseInUSD,riseInUSD);
      compareRates(prevRateGBP.current, fetchedDetails.bpi.GBP.rate, setRiseInGBP, riseInGBP);
      compareRates(prevRateEUR.current, fetchedDetails.bpi.EUR.rate,setRiseInEUR,riseInEUR);

      //assigning previous rates to ref
      prevRateUSD.current = latestUSD;
      prevRateGBP.current = latestGBP;
      prevRateEUR.current = latestEUR;
    }

    function compareRates(prevRate, currentRate, setRise, rise) {
      console.log("Prev rate and Latest rate");
      console.log(prevRate + "|" + currentRate);
      if (prevRate < currentRate) {
        console.log("increased");
        setRise(true);
        console.log("rise:" + rise);
      } else if (prevRate >= currentRate) {
        console.log("decreased or same");
        setRise(false);
        console.log("rise:" + rise);
      }
    }
  }, [currentTime, stockArray, latestUSD, latestEUR, latestGBP, riseInUSD, riseInGBP, riseInEUR]);

  const updateCard = (
    <div className={classes.smallCard}>
      <div>
        prevUSD - ${prevRateUSD.current}, currentUSD - ${latestUSD},{" "}
        {riseInUSD && <div className={classes.green}>Increased!</div>}{" "}
        {!riseInUSD && <div className={classes.yellow}>Decreased/same</div>}
      </div>
      <div>
        prevGBP - £{prevRateGBP.current}, currentGBP - £{latestGBP},{" "}
        {riseInGBP && <div className={classes.green}>Increased!</div>}{" "}
        {!riseInGBP && <div className={classes.yellow}>Decreased/same</div>}
      </div>
      <div>
        prevRateEUR - €{prevRateEUR.current}, currentEUR - €{latestEUR},{" "}
        {riseInEUR && <div className={classes.green}>Increased!</div>}{" "}
        {!riseInEUR && <div className={classes.yellow}>Decreased/same</div>}
      </div>
    </div>
  );

  return (
    <Fragment>
      {updateCard}
      <DisplayTable tableContentArr={stockArray} />
    </Fragment>
  );
};

export default DisplayStockRates;
