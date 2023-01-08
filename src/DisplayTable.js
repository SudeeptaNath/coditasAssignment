import { Fragment } from "react";
import classes from "./styles.module.css";

const DisplayTable = (props) => {
  //reversed array to display latest items first
  const reversedTableContentArr = [...props.tableContentArr].reverse();

  return (
    <Fragment>
      <table className={classes.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>USD</th>
            <th>Change</th>
            <th>GBP</th>
            <th>Change</th>
            <th>EUR</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {reversedTableContentArr.map((item, i) => {
            return (
              <tr key={i}>
                <td>{item.time.updated}</td>
                <td>{item.bpi.USD.rate}</td>
                <td>
                  {item.riseInUSD && "^"} {!item.riseInUSD && "v / ="}
                </td>
                <td>{item.bpi.GBP.rate}</td>
                <td>
                  {item.riseInGBP && "^"} {!item.riseInGBP && "v / ="}
                </td>
                <td>{item.bpi.EUR.rate}</td>
                <td>
                  {item.riseInEUR && "^"} {!item.riseInEUR && "v / ="}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Fragment>
  );
};

export default DisplayTable;
