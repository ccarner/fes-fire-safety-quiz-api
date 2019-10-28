import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import { Navbar } from "./modules/ui";
import { Home } from "./modules/pages";
import { ContentPage } from "./modules/pages";
import { QuizPage } from "./modules/pages";
import { ChecklistPage } from "./modules/pages";
import { ChecklistEditor } from "./modules/checklists";
import { QuizEditor } from "./modules/quizzes";

/* Entry point of the React App, all other components are children of App.
  also serves as a router */
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Switch>
            {/* use a switch so we only render max of ONE of these pages */}
            <Route path="/" exact component={Home} />
            <Route
              path="/editChecklist"
              render={routeProps => <ChecklistEditor />}
            />
            <Route path="/editQuiz" render={routeProps => <QuizEditor />} />
            {/* including props inside of route,  can get props this way... */}
            <Route path="/quizzes" render={props => <QuizPage />} />
            <Route
              path="/modules"
              render={props => (
                <ContentPage contentType="module" heading="Modules" />
              )}
            />

            <Route path="/checklists" render={props => <ChecklistPage />} />
            <Route
              path="/media"
              render={props => (
                <ContentPage contentType="media" heading="Media" />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
