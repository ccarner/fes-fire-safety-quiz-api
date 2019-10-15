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
    var hideButtonText = this.props.filename.includes("hidden_")
      ? "Unhide"
      : "Hide";
    return (
      <React.Fragment>
        <div class="col-sm-7 col-xs-4 my-auto">{this.props.filename}</div>
        <div class="col-sm-5 col-xs-8 my-auto">
          <Button
            onClick={() => this.props.handleView(this.props.filename)}
            variant="contained"
            color="default"
          >
            View
          </Button>
          {this.props.filename !== "index.json" && (
            <Button
              onClick={() => this.props.handleDelete(this.props.filename)}
              variant="contained"
              color="default"
            >
              Delete
            </Button>
          )}
          {this.props.handleEdit && this.props.filename !== "index.json" && (
            <Button
              onClick={() => this.props.handleEdit(this.props.filename)}
              variant="contained"
              color="default"
            >
              edit
            </Button>
          )}{" "}
          {this.props.handleHide && this.props.filename !== "index.json" && (
            <Button
              onClick={() => this.props.handleHide(this.props.filename)}
              variant="contained"
              color="default"
            >
              {hideButtonText}
            </Button>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default FileViewerRow;
