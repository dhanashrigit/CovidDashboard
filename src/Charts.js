import mapDataIE from "@highcharts/map-collection/custom/world.geo.json";
import { Container, Grid, Link, Paper } from "@material-ui/core";
import { text } from "d3";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsExport from "highcharts/modules/exporting";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useStyles } from "./CommonStyles";
import { getCountryCode } from "./CountryCodes";
import CountryWiseStats from "./CountryWiseStats";
import NewsCards from "./NewsCards";
highchartsMap(Highcharts);
highchartsExport(Highcharts);

var data1 = [];
function Charts() {
  const classes = useStyles();
  const history = useHistory();
  const [cases, setCases] = useState([]);
  const [country, setCountry] = useState("");
  const [countryName, setCountryName] = useState("");
  const [showData, setShowData] = useState(false);
  const [totalCases, setTotalCases] = useState("");

  useEffect(() => {
    text("dataset.csv").then((data) => {
      let csv1 = data.split(/\n/);
      csv1.slice(1).forEach((element) => {
        element = element.split(",");
        let code = getCountryCode(element[0]).toLowerCase();
        data1.push([code, element[element.length - 1]]);
      });
      setCases(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (typeof window !== "undefined") {
    window.proj4 = window.proj4 || proj4;
  }

  const viewMoreData = () => {
    history.push({ pathname: "/country", state: { countryName, totalCases } });
  };

  const mapOptions = {
    chart: {
      map: "geojson",
    },
    title: {
      text: "Covid-19 Data Tracker",
    },
    subtitle: {
      text: "Country Specific Data",
    },
    legend: {
      title: {
        text: "Number of Cases",
        style: {
          color: "black",
        },
      },
      align: "left",
      verticalAlign: "bottom",
      floating: true,
      layout: "vertical",
      valueDecimals: 0,
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      symbolRadius: 0,
      symbolHeight: 14,
    },
    credits: {
      enabled: false,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "top",
      },
    },
    colorAxis: {
      dataClasses: [
        {
          to: 100,
        },
        {
          from: 100,
          to: 500,
        },
        {
          from: 500,
          to: 1000,
        },
        {
          from: 1000,
          to: 5000,
        },
        {
          from: 5000,
          to: 10000,
        },
        {
          from: 10000,
          to: 50000,
        },
        {
          from: 50000,
        },
      ],
    },
    series: [
      {
        name: "Total Confirmed Covid Cases",
        allowPointSelect: true,
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              setShowData(false);
              let code = getCountryCode(this.name);
              setTotalCases(this.value);
              setCountryName(this.name);
              setCountry(code.toLowerCase());
              setShowData(true);
            },
          },
        },
        data: data1,
        mapData: mapDataIE,
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false,
        states: {
          hover: {
            color: "#FF5733",
            borderColor: "#44a32",
            dashStyle: "shortlines",
          },
          select: {
            color: "#EBF021",
            borderColor: "#44a32",
            dashStyle: "shortlines",
          },
        },
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container style={{ padding: "1rem" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={11} className={classes.paper}>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"mapChart"}
              options={mapOptions}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          {showData && (
            <Paper elevation={11} className={classes.paper}>
              <CountryWiseStats
                totalCases={totalCases}
                countryName={countryName}
                country={country}
              />
              <Link
                className={classes.small}
                onClick={(e) => {
                  viewMoreData(e);
                }}
              >
                View Statistics
              </Link>
            </Paper>
          )}
        </Grid>
        <Grid item xs={8}>
          {showData && (
            <Paper elevation={11} className={classes.paper}>
              <NewsCards country={country} />
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Charts;
