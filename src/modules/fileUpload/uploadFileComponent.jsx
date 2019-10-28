import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadFiles } from "../../utils";

/* react component used to display a file uploader and progress bar.
 Can upload multiple files to the API server at once */
class UploadFileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFiles: null,
      loaded: 0
    };
    this.uploadProgressCallback = this.uploadProgressCallback.bind(this);
  }

  onChangeHandler = event => {
    var files = event.target.files;
    if (
      this.maxSelectFile(event)
      // only implemented max field numebr checker, doesn't care about size etc
      // but could add those as below:
      // &&
      // this.checkMimeType(event) &&
      // this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectedFiles: files,
        loaded: 0
      });
    }
  };

  /* used to update the progress bar */
  uploadProgressCallback(ProgressEvent) {
    this.setState({
      loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
    });
  }

  // for uploading file
  onClickHandler = () => {
    if (this.state.selectedFiles) {
      uploadFiles(
        this.state.selectedFiles,
        this.props.uploadURL,
        this.uploadProgressCallback
      )
        .then(res => {
          toast.success("upload success");
          this.props.handleUpdate();
        })
        .catch(err => {
          console.error(err);
          toast.error("upload fail");
        });
    } else {
      toast.error("No files selected for upload");
    }
  };

  /* set a maximum number of files to upload to prevent accidental mass uploads */
  maxSelectFile = event => {
    let files = event.target.files; // create file object
    if (files.length > 10) {
      const msg = "Only 10 files can be uploaded at a time";
      event.target.value = null; // discard selected file
      alert(msg);
      return false;
    }
    return true;
  };

  render() {
    return (
      <React.Fragment>
        <div class=" bordered form-group files">
          <input
            id="uploadComponent"
            type="file"
            class=""
            multiple
            onChange={this.onChangeHandler}
          />
        </div>
        <div class="form-group">
          <ToastContainer />
          <div class="progress">
            <div
              class="progress-bar"
              style={{ width: this.state.loaded + "%" }}
            >
              {this.state.loaded} %
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-success btn-block this.state.selectedFiles"
          onClick={this.onClickHandler}
          disabled={!this.state.selectedFiles}
        >
          Upload
        </button>
      </React.Fragment>
    );
  }
}

export default UploadFileComponent;
