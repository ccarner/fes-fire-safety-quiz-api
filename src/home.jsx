import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1> View & Edit Quiz components</h1>
        <Button
          component={Link}
          to="/quizzes"
          variant="contained"
          color="default"
        >
          quizzes
        </Button>

        <h1> View & Edit Module components</h1>
        <Button
          component={Link}
          to="/modules"
          variant="contained"
          color="default"
        >
          modules
        </Button>

        <h1> View & Edit Checklist components</h1>
        <Button
          component={Link}
          to="/checklists"
          variant="contained"
          color="default"
        >
          checklists
        </Button>
      </React.Fragment>
    );
  }
}

export default Home;
