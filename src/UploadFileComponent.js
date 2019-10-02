import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Progress } from "reactstrap";
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
      })
      .catch(err => {
        toast.error("upload fail");
      });
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
      <div class="container">
        <div class="row">
          <div class="offset-md-3 col-md-6">
            <div class="form-group files">
              <label>Upload Your File </label>
              <input
                type="file"
                class="form-control"
                multiple
                onChange={this.onChangeHandler}
              />
            </div>
            <div class="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
              </Progress>
            </div>
            <button
              type="button"
              class="btn btn-success btn-block"
              onClick={this.onClickHandler}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadFileComponent;
