import { BrowserRouter as Router, Route } from "react-router-dom";
import Charts from "./Charts";
import CountryWiseStats from "./CountryWiseStats";

function App() {
  return (
    <Router>
      <Route exact path="/">
        Go To Dashboard
      </Route>
      <Route exact path="/dashboard">
        <Charts />
      </Route>
      <Route exact path="/country">
        <CountryWiseStats />
      </Route>
    </Router>
  );
}

export default App;
