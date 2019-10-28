import React from "react";
import "react-toastify/dist/ReactToastify.css";
import FileViewerRow from "./fileViewerRow";

// give it a prop of the directory (so can delete/download) and also
// prop with the original JSON of index of the files

/* react component used to display a list of files available on the API server */
class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    // this.updateIndex = this.updateIndex.bind(this);
    this.state = {
      index: props.index
    };
  }

  /* update the files currently available on the server */
  updateIndex(newIndex) {
    this.setState({ index: newIndex });
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
                handleEdit={this.props.handleEdit}
                handleHide={this.props.handleHide}
                contentType={this.props.contentType}
              ></FileViewerRow>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default FileViewer;
