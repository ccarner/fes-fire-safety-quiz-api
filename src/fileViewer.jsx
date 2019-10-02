import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

class FileViewer extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1> Files on Server:</h1>

        {this.props.index.map(file => (
          <li> {file.filename}</li>
        ))}

        <Button
          onClick={() => {
            axios.delete("http://localhost:8000/content/quizzes/index.json");
          }}
          to="/quizzes"
          variant="contained"
          color="default"
        >
          delete something
        </Button>

        {/* {JSON.parse(this.props.index).map(file => (
          <h1> a file </h1>
        ))} */}
      </React.Fragment>
    );
  }
}

export default FileViewer;
