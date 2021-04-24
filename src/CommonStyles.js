import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  heading: {
    background: "#4d70b8",
    fontSize: "large",
    color: "aliceblue",
    fontWeight: 700,
    fontVariantCaps: "all-small-caps",
  },
  subheading: {
    marginTop:"0.5rem",
    background: "antiquewhite",
    fontSize: "0.9rem",
    color: "black",
  },
  titleStyle: {
    fontWeight: 700,
    fontSize: "medium",
    fontVariantCaps: "all-small-caps",
    background:"antiquewhite",
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  bodyStyle: {
    fontWeight: 200,
    fontSize: "small",
  },
  small: {
    fontSize: "0.7rem",
  },
  table: {
    maxWidth: 650,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  alignTable: {
    marginTop:"1rem",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
  },
  cardGrid: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    padding:"10px",
    flexGrow: 1,
  },
}));
