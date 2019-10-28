import React from "react";
import Button from "@material-ui/core/Button";

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

/* display for one single file on the server, used in the fileViewer */
class FileViewerRow extends React.Component {
  // logic to render controls available given the page we're currently on
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
    //option to hide/unhide depending on the name (note the same command is sent to API either way, its a toggle)
    var hideButtonText = this.props.filename.includes("hidden_")
      ? "Unhide"
      : "Hide";

    return (
      <React.Fragment>
        <div class="col-sm-6 col-xs-4 my-auto">{this.props.filename}</div>
        <div class="col-sm-6 col-xs-8 my-auto">
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
