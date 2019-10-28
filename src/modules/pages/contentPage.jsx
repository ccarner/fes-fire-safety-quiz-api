import React from "react";
import { UploadFileComponent } from "../fileUpload";
import { FileViewer } from "../fileViewer";
import axios from "axios";
import { Config } from "../../utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* generic page for showing a file uploader + a fiew viewer.
  takes in the content type as a prop and determines the API url to use based on that */
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

  // after executing some action (eg deleting/uploading) get a fresh copy
  // of the index from the server
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
      })
      .catch(err => {
        console.error("error response is", err.response);
      });
  }

  // 'edit' a file, if applicable (eg for quizzes/checklists)
  handleEdit(filename) {
    return axios
      .get(this.state.contentUrl + "/" + filename, { withCredentials: true })
      .then(response => response.data)
      .then(data => {
        this.props.handleEdit(data);
      })
      .catch(err => {
        console.error("error response is", err.response);
      });
  }

  //hide the file, uses an HTTP patch request
  handleHide(filename) {
    const url = new URL(filename, this.state.contentUrl + "/");
    axios
      .patch(url, { withCredentials: true })
      .then(res => {
        toast.success("Hide success");
      })
      .catch(err => {
        console.error("error response is", err.response, err.response.status);
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

  // delete a file from the server
  handleDelete(filename) {
    const url = new URL(filename, this.state.contentUrl + "/");
    axios
      .delete(url, { withCredentials: true })
      .then(res => {
        toast.success("delete success");
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        // update index
        this.updateIndex();
      });
  }

  // view the fiole in a new tab
  handleView(filename) {
    // note had to bind THIS in the constructor!
    const url = new URL(filename, this.state.contentUrl + "/");
    window.open(url);
  }

  renderFilePane() {
    //only render after promise returned for fetching the index
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
          contentType={this.props.contentType}
        ></FileViewer>
      );
    } else {
      // promise not resolved, loading...
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
            <div class="col-xl-5 offset-xl-1">
              <h3> Files on Server:</h3>
              {this.renderFilePane()}
            </div>
            <div class="col-xl-5 upload-component">
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
