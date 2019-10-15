import React from "react";
import UploadFileComponent from "./UploadFileComponent.js";
import FileViewer from "./fileViewer.jsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import Config from "./config.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class ContentPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleView = this.handleView.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.updateIndex = this.updateIndex.bind(this);
    this.handleHide = this.handleHide.bind(this);

    this.state = {
      filesOnServer: null,
      contentUrl: Config.getUrl(this.props.contentType)
    };
  }

  componentDidMount() {
    this.updateIndex();
  }

  updateIndex() {
    axios
      .get(this.state.contentUrl + "/" + Config.getIndexFileName())
      .then(response => response.data)
      .then(data => {
        this.fileViewerComponent &&
          //this.fileViewerComponent.setState({ index: data });
          this.fileViewerComponent.updateIndex(data);
        this.setState({
          filesOnServer: data
        });
        console.log("here inside of contentPage updateIndex", data);
      })
      .catch(err => {
        console.log("error response is", err.response);
      });
  }

  handleEdit(filename) {
    return axios
      .get(this.state.contentUrl + "/" + filename)
      .then(response => response.data)
      .then(data => {
        this.props.handleEdit(data);
      })
      .catch(err => {
        console.log("error response is", err.response);
      });
  }

  handleHide(filename) {
    const url = new URL(filename, this.state.contentUrl + "/");
    axios
      .patch(url)
      .then(res => {
        toast.success("Hide success");
      })
      .catch(err => {
        console.log("error response is", err.response, err.response.status);
        if (err.response.status === 404) {
          toast.error(
            "Hide failed: asset does not exist. Please refresh the page"
          );
        } else {
          toast.error("Hide failed, unknown error");
        }
      })
      .finally(() => {
        // update index
        this.updateIndex();
      });
  }

  handleDelete(filename) {
    const url = new URL(filename, this.state.contentUrl + "/");
    axios
      .delete(url)
      .then(res => {
        toast.success("delete success");
      })
      .catch(err => {
        console.log("error response is", err.response, err.response.status);
        if (err.response.status === 404) {
          toast.error(
            "Delete failed: asset does not exist. Please refresh the page"
          );
        } else {
          toast.error("Delete failed, unknown error");
        }
      })
      .finally(() => {
        // update index
        this.updateIndex();
      });
  }

  handleView(filename) {
    // note had to bind THIS in the constructor!
    const url = new URL(filename, this.state.contentUrl + "/");
    window.open(url);
  }

  //only render after promise returned
  renderFilePane() {
    if (this.state.filesOnServer) {
      return (
        <FileViewer
          // ref is so we can update index in component
          ref={this.fileViewerComponent}
          index={this.state.filesOnServer}
          handleView={this.handleView}
          handleDelete={this.handleDelete}
          handleEdit={this.handleEdit}
          handleHide={this.handleHide}
        ></FileViewer>
      );
    } else {
      return (
        <React.Fragment>
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>{this.props.heading}</h1>
        <div class="container-fluid">
          <div class="row">
            <div class="col">
              <h1> {this.contentType} </h1>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 offset-lg-2">
              <h3> Files on Server:</h3>
              {this.renderFilePane()}
            </div>
            <div class="col-lg-4">
              <h3> Upload new content:</h3>
              <UploadFileComponent
                uploadURL={this.state.contentUrl}
                handleUpdate={this.updateIndex}
              ></UploadFileComponent>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ContentPage;
