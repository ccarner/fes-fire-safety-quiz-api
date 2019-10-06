import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

class FileViewerRow extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h3> this.props.filename </h3>

        <Button
          onClick={() => this.props.handleView(this.props.fileName)}
          variant="contained"
          color="default"
        >
          View
        </Button>

        <Button
          onClick={() => this.props.handleDelete(this.props.fileName)}
          variant="contained"
          color="default"
        >
          Delete
        </Button>
      </React.Fragment>
    );
  }
}

export default FileViewerRow;
