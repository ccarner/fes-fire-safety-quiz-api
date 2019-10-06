import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./home.jsx";
import NavBar from "./navbar";
import Quizzes from "./quizzes";
import Checklists from "./checklists";
import Modules from "./modules";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            {/* use a switch so we only render max of ONE of these pages */}
            <Route path="/" exact component={Home} />
            <Route path="/quizzes" exact component={Quizzes} />
            <Route path="/modules" exact component={Modules} />
            <Route path="/checklists" exact component={Checklists} />

            {/* <Route
            path="/api/quizzes"
            component={() => (window.location = "localhost:5000/api/quizzes")}
          /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
