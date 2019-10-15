import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Home from "./home.jsx";
import NavBar from "./navbar";
import ContentPage from "./contentPage";
import QuizEditor from "./quizEditor.jsx";
import QuizPage from "./quizPage.jsx";

class App extends React.Component {
  render() {
    // {
    //   let props = {
    //     contentTypeQuiz: "quiz",
    //     contentTypeMedia: "media",
    //     contentTypeChecklist: "checklist",
    //     contentTypeModule: "module"
    //   };
    // }
    return (
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <Switch>
            {/* use a switch so we only render max of ONE of these pages */}
            <Route path="/" exact component={Home} />
            <Route path="/editQuiz" render={routeProps => <QuizEditor />} />
            {/* including props inside of route,  can get props this way... */}
            <Route path="/quizzes" render={props => <QuizPage />} />
            <Route
              path="/modules"
              render={props => (
                <ContentPage contentType="module" heading="Modules" />
              )}
            />

            <Route
              path="/checklists"
              render={props => (
                <ContentPage contentType="checklist" heading="Checklists" />
              )}
            />
            <Route
              path="/media"
              render={props => (
                <ContentPage contentType="media" heading="Media" />
              )}
            />
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
