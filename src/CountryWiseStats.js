import {
  Container,
  FormControl,
  Link,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { text } from "d3";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import highchartsExport from "highcharts/modules/exporting";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useStyles } from "./CommonStyles";
highchartsExport(Highcharts);

var countries = [];
var dayMonth = [];
let xval = [];
let data_row = [];

export default function CountryWiseStats({ countryName, totalCases, country }) {
  const classes = useStyles();
  const location = useLocation();
  const [show, setshow] = useState(false);
  const history = useHistory();
  const viewMoreFlag = window.location.pathname;
  const [num, setNum] = React.useState(5);

  const handleChange = (event) => {
    setNum(event.target.value);
  };

  if (viewMoreFlag === "/country") {
    countryName = location.state.countryName;
    totalCases = location.state.totalCases;
  }

  useEffect(() => {
    countries = [];
    dayMonth = [];
    xval = [];
    data_row = [];
    text("dataset.csv").then((data) => {
      let csv1 = data.split(/\n/);
      xval = csv1[0].split(",").slice(1).map(Number);
      csv1.slice(1).forEach((element) => {
        element = element.split(",");
        if (countryName.includes(element[0])) {
          data_row = element.slice(1).map(Number);
          var changedData = [],
            percentChange = [],
            temp = 0;
          data_row.forEach(function (value) {
            changedData.push(value - temp);
            temp = value;
          });
          temp = changedData[0];
          changedData.forEach(function (value) {
            var current;
            if (temp !== 0) {
              current = parseInt(((value - temp) / temp) * 100);
            } else {
              current = 0;
            }
            temp = value;
            percentChange.push(current);
          });
          xval.map((val) => {
            let date = val % 100;
            let month = (val - date) / 100;
            dayMonth.push(date + "-" + month);
          });
          countries.push({
            data: changedData,
            change: percentChange,
            total: element[element.length - 1],
          });
        }
      });
      setshow(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    exporting: {
      enabled: true,
    },
    chart: {
      type: "column",
    },
    colors: ["#FF0A0A"],
    title: {
      text: `${countryName} - Daily Change in Cases`,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      labels: {
        formatter: function () {
          let temp = xval[this.value];
          let date = temp % 100;
          let month = (temp - date) / 100;
          return date + "/" + month;
        },
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Number of Cases",
      },
    },
    series: [
      {
        data: countries.length && countries[0].data,
        name: "Change Per Day",
      },
    ],
  };

  const options1 = {
    exporting: {
      enabled: true,
    },
    chart: {
      type: "column",
    },
    colors: ["#FF0A0A"],
    title: {
      text: `${countryName} - Cumulative Cases`,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      labels: {
        formatter: function () {
          let temp = xval[this.value];
          let day = temp % 100;
          let month = (temp - day) / 100;
          return day + "/" + month;
        },
      },
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Number of Cases",
      },
    },
    series: [
      {
        data: data_row,
        name: "Cumulative total",
      },
    ],
  };

  const CustomTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "beige",
      color: "black",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  function createData(num) {
    return Array(num).fill(0);
  }

  const goToDashboard = () => {
    history.push("/dashboard");
  };

  const rows = createData(num);

  return (
    <div>
      {viewMoreFlag === "/country" ? (
        <Container style={{ padding: "1rem" }}>
          <Link
            onClick={(e) => {
              goToDashboard(e);
            }}
          >
            Go To Dashboard
          </Link>
          <Paper elevation={11} className={classes.paper}>
            <HighchartsReact highcharts={Highcharts} options={options} />
          </Paper>
          <Paper
            style={{ marginTop: "1rem" }}
            elevation={11}
            className={classes.paper}
          >
            <HighchartsReact highcharts={Highcharts} options={options1} />
          </Paper>
        </Container>
      ) : (
        <>
          <Typography className={classes.heading}>
            Day wise cases in {countryName}
          </Typography>
          <Typography className={classes.subheading}>
            Total Confirmed Cases: {totalCases}
          </Typography>
          <FormControl
            style={{ textAlign: "end", display: "inherit" }}
            className={classes.formControl}
          >
            <Select
              value={num}
              size="small"
              onChange={handleChange}
              style={{
                background: "#eaf2f5",
                marginTop: "0.5rem",
                fontSize: "0.9rem",
              }}
            >
              <MenuItem value={5}>Five Days</MenuItem>
              <MenuItem value={10}>Ten Days</MenuItem>
              <MenuItem value={20}>Twenty Days</MenuItem>
            </Select>
          </FormControl>
          <TableContainer className={classes.alignTable} component={Paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Date</CustomTableCell>
                  <CustomTableCell align="center">New Cases</CustomTableCell>
                  <CustomTableCell align="right"> Change</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow className={classes.row} key={index}>
                    <CustomTableCell component="th" scope="row">
                      {
                        dayMonth.slice(Math.max(dayMonth.length - num, 0))[
                          index
                        ]
                      }
                    </CustomTableCell>
                    <CustomTableCell align="center">
                      {countries.length
                        ? countries[0].data.slice(
                            Math.max(countries[0].data.length - num, 0)
                          )[index]
                        : ""}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {countries.length
                        ? countries[0].change.slice(
                            Math.max(countries[0].change.length - num, 0)
                          )[index] + "%"
                        : ""}
                    </CustomTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}
