import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStyles } from "./CommonStyles";

//API key 097cc8b42671470a87a33255697def3e
//API KEY 73cbb1bdca7c430fb5333749cf70adb0

export default function Album({ country }) {
  const classes = useStyles();
  const [news, setNews] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    let link1 = `http://newsapi.org/v2/top-headlines?country=${country}&apikey=097cc8b42671470a87a33255697def3e`;
    let link2 = `http://newsapi.org/v2/top-headlines?q=coronavirus&language=en&category=health&country=${country}&apikey=097cc8b42671470a87a33255697def3e`;

    axios
      .get(link2)
      .then((response) => {
        if (response.data.articles.length) {
          setNews(response.data.articles);
        } else {
          axios.get(link1).then((res) => {
            if (res.data.articles.length) {
              setNews(res.data.articles);
            } else {
              setFlag(true);
            }
          });
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography className={classes.heading}>Recent News</Typography>
      <Container className={classes.cardGrid} maxWidth="md">
        {news.length > 0 ? (
          <Grid container spacing={4}>
            {news.map((n, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card elevation={5} className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image={n.urlToImage}
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography
                      className={classes.titleStyle}
                      gutterBottom
                      variant="h6"
                      component="h2"
                    >
                      {n.title}
                    </Typography>
                    <Typography className={classes.bodyStyle}>
                      {n.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Link
                      className={classes.small}
                      href={n.url}
                      target="_blank"
                    >
                      View Full Article
                    </Link>
                    <Typography className={classes.small}>
                      {moment(n.publishedAt).format("Do MMM YYYY H:mm")}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            {flag ? (
              <Alert severity="warning">
                No news from the selected country is available at the moment.
              </Alert>
            ) : (
              <CircularProgress />
            )}
          </>
        )}
      </Container>
    </>
  );
}
