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
  handleDelete(fileName) {
    // delete logic here
  }

  render() {
    return (
      <React.Fragment>
        <h1> Files on Server:</h1>

        {this.props.index.map(file => (
          <li>
            {" "}
            <FileViewerRow
              filename={file.filename}
              handleView={this.handleView}
              handleDelete={this.handleDelete}
            ></FileViewerRow>
          </li>
        ))}

        <Button
          onClick={() => {
            console.log(" props url is:", this.props.url);
            const url = new URL("1570068051618-leancoffee.png", this.props.url);
            console.log("url is:", url);
            axios
              .delete(url)
              .then(res => {
                toast.success("delete success");
                console.log(res.statusText);
              })
              .catch(err => {
                console.log(
                  "error response is",
                  err.response,
                  err.response.status
                );
                if (err.response.status === 404) {
                  toast.error(
                    "Delete failed: asset does not exist. Please refresh the page"
                  );
                } else {
                  toast.error("Delete failed, unknown error");
                }
              });
          }}
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
