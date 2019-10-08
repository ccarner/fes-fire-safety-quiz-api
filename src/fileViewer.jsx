import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";
import FileViewerRow from "./fileViewerRow";
const url = require("url");

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    // this.updateIndex = this.updateIndex.bind(this);
    this.state = {
      index: props.index,
      updated: 1
    };
  }

  updateIndex(newIndex) {
    console.log("here inside of fileViewer udpateIndex");
    this.setState({ index: newIndex, updated: this.state.updated + 1 });
  }

  render() {
    return (
      <React.Fragment>
        <div id="fileViewer" class="container-fluid">
          {this.props.index.map(file => (
            //h-100 makes it full height
            <div
              class="row h-100"
              style={{ border: "1px solid #cecece", height: "100%" }}
            >
              {" "}
              <FileViewerRow
                filename={file.filename}
                handleView={this.props.handleView}
                handleDelete={this.props.handleDelete}
              ></FileViewerRow>
            </div>
          ))}
        </div>

        {/* {JSON.parse(this.props.index).map(file => (
          <h1> a file </h1>
        ))} */}
      </React.Fragment>
    );
  }
}

export default FileViewer;
