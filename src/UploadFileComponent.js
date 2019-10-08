import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

class UploadFileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    };
  }

  onChangeHandler = event => {
    var files = event.target.files;
    if (
      this.maxSelectFile(event)
      // only implemented max fiel numebr chacker, doesn't care about size etc
      // &&
      // this.checkMimeType(event) &&
      // this.checkFileSize(event)
    ) {
      // if return true allow to setState
      this.setState({
        selectedFile: files,
        loaded: 0
      });
    }
  };

  // for uploading file
  onClickHandler = () => {
    if (this.state.selectedFile) {
      const data = new FormData();
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }
      axios
        .post(this.props.uploadURL, data, {
          // receive two parameter endpoint url ,form data
          onUploadProgress: ProgressEvent => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(res => {
          toast.success("upload success");
          console.log(res.statusText);
          this.props.handleUpdate();
        })
        .catch(err => {
          console.log(err);
          toast.error("upload fail");
        });
    } else {
      toast.error("No files selected for upload");
    }
  };

  maxSelectFile = event => {
    let files = event.target.files; // create file object
    if (files.length > 10) {
      const msg = "Only 10 files can be uploaded at a time";
      event.target.value = null; // discard selected file
      console.log(msg);
      alert(msg);
      return false;
    }
    return true;
  };

  render() {
    return (
      <React.Fragment>
        <div class="form-group files">
          <input
            type="file"
            class="form-control"
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
          class="btn btn-success btn-block this.state.selectedFile"
          onClick={this.onClickHandler}
          disabled={!this.state.selectedFile}
        >
          Upload
        </button>
      </React.Fragment>
    );
  }
}

export default UploadFileComponent;
