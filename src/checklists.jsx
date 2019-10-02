import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

class Checklists extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1> upload Checklists here</h1>
        <UploadFileComponent uploadURL="http://localhost:8000/content/checklists"></UploadFileComponent>
      </React.Fragment>
    );
  }
}

export default Checklists;
