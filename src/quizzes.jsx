import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import FileViewer from "./fileViewer.jsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";

class Quizzes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filesOnServer: null
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:8000/content/quizzes/index.json")
      .then(response => response.data)
      .then(data => {
        this.setState({
          filesOnServer: data
        });
        console.log(data);
      });
  }

  render() {
    return (
      <React.Fragment>
        <h1> upload quizzes here</h1>
        <UploadFileComponent uploadURL="http://localhost:8000/content/quizzes"></UploadFileComponent>
        {/* only render AFTER promise resolved */}
        {console.log("rendering new fileviewer")}
        {this.state.filesOnServer && (
          <FileViewer index={this.state.filesOnServer}></FileViewer>
        )}
      </React.Fragment>
    );
  }
}

export default Quizzes;
