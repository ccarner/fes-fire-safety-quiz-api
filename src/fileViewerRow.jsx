import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

class FileViewerRow extends React.Component {
  renderExtraButtons(buttonType) {
    let notValid = {
      module: ["edit"],
      media: ["edit", "hide"]
    };
    let invalid = notValid[this.props.contentType];
    if (invalid && invalid.includes(buttonType)) {
      return false;
    }
    return true;
  }
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
            style={{ margin: 8 }}
          >
            View
          </Button>
          {this.props.filename !== "index.json" && this.renderExtraButtons() && (
            <Button
              onClick={() => this.props.handleDelete(this.props.filename)}
              variant="contained"
              color="default"
              style={{ margin: 8 }}
            >
              Delete
            </Button>
          )}
          {this.props.handleEdit &&
            this.props.filename !== "index.json" &&
            this.renderExtraButtons("edit") && (
              <Button
                onClick={() => this.props.handleEdit(this.props.filename)}
                variant="contained"
                color="default"
                style={{ margin: 8 }}
              >
                edit
              </Button>
            )}{" "}
          {this.props.handleHide &&
            this.props.filename !== "index.json" &&
            this.renderExtraButtons("hide") && (
              <Button
                onClick={() => this.props.handleHide(this.props.filename)}
                variant="contained"
                color="default"
                style={{ margin: 8 }}
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
