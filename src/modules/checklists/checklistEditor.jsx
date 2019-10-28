import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Config } from "../../utils";
import { uploadFiles } from "../../utils";
import { withRouter } from "react-router";
import ChecklistSectionEditor from "./checklistSectionEditor.jsx";

/* Entry class for creating/ editing a checklist. Single source of truth for checklist state */
class ChecklistEditor extends React.Component {
  constructor(props) {
    super(props);
    this.saveChecklist = this.saveChecklist.bind(this);
    this.handleSectionAdd = this.handleSectionAdd.bind(this);
    this.handleSectionDelete = this.handleSectionDelete.bind(this);
    this.handleSectionMove = this.handleSectionMove.bind(this);
    this.handleChecklistMetadataUpdate = this.handleChecklistMetadataUpdate.bind(
      this
    );
    this.handleSectionUpdate = this.handleSectionUpdate.bind(this);
    // template for when a new section is added
    this.emptySection = { section_name: "new section", questions: [] };

    // this component can be used for editing an existing checklist or creating a new one
    try {
      // for 'editing' an existing checklist
      this.state = {
        checklistObject: this.props.location.state.checklistEditing
      };
    } catch (err) {
      // making a new one instead...
      this.state = {
        checklistObject: {
          checklist_questions: [],
          metadata: {
            title: "New Checklist",
            description: "New checklist Description"
          }
        }
      };
    }
  }

  // section was modified, update it
  handleSectionUpdate(sectionNumber, newSection) {
    this.setState(prevState => {
      let newChecklistObject = prevState.checklistObject;
      newChecklistObject.checklist_questions[sectionNumber] = newSection;
      return { checklistObject: newChecklistObject };
    });
  }

  // section was deleted, update the state
  handleSectionDelete(event) {
    event.preventDefault();
    let sectionNumber = event.target.getAttribute("section");
    this.setState(prevState => {
      let checklistObject = { ...prevState.checklistObject };

      //remove question from the array
      checklistObject["checklist_questions"].splice(sectionNumber, 1);

      return { checklistObject }; // return new object
    });
  }

  //section was added, update the state
  handleSectionAdd(event) {
    event.preventDefault();
    this.setState(prevState => {
      let checklistObject = { ...prevState.checklistObject }; // creating copy of state variable
      // need to create a new checklist object which is a DEEP COPY of the empty question template...
      var newSection = { ...this.emptySection };

      checklistObject["checklist_questions"].push(newSection);
      return { checklistObject }; // return new object
    });
  }

  //section was moved, update the state
  handleSectionMove(event) {
    event.preventDefault();

    let sectionNumber = parseInt(event.target.getAttribute("section"));
    var swapSectionNumber;
    if (event.target.getAttribute("move") === "down") {
      swapSectionNumber = sectionNumber + 1;
    } else {
      swapSectionNumber = sectionNumber - 1;
    }
    this.setState(prevState => {
      let checklistObject = { ...prevState.checklistObject };
      //temp copy to make the swap
      var temp = checklistObject["checklist_questions"][sectionNumber];

      checklistObject["checklist_questions"][sectionNumber] =
        checklistObject["checklist_questions"][swapSectionNumber];

      checklistObject["checklist_questions"][swapSectionNumber] = temp;

      return { checklistObject }; // return new object
    });
  }

  // save the checklist to the server
  saveChecklist() {
    var f = new File(
      [JSON.stringify(this.state.checklistObject)],
      this.state.checklistObject.metadata.title + ".json",
      {
        type: "application/json"
      }
    );
    var contentUrl = Config.getUrl("checklist");
    uploadFiles([f], contentUrl, undefined)
      .then(res => {
        toast.success("upload success");
      })
      .catch(err => {
        console.error(err);
        toast.error("upload fail");
      });
  }

  // update metadata fields which don't require a deep copy (ie only title and description)
  handleChecklistMetadataUpdate(event) {
    // event.persist();
    var value = event.target.value;
    var field = event.target.getAttribute("field");
    this.setState(prevState => {
      let checklistObject = { ...prevState.checklistObject }; // creating copy of state variable
      checklistObject.metadata = { ...prevState.checklistObject.metadata };
      // need to create a new checklist object which is a DEEP COPY of the empty question template...
      checklistObject.metadata[field] = value;
      return { checklistObject }; // return new object
    });
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <h1> Edit Checklist </h1>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <form class="form bordered">
                <h3> Title + Description</h3>
                <div class="form-group">
                  <label>Provide a title for the Checklist:</label>
                  <input
                    class="form-control"
                    type="text"
                    field="title"
                    // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                    // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                    value={this.state.checklistObject.metadata.title || ""}
                    onChange={this.handleChecklistMetadataUpdate}
                  />
                </div>
                <div class="form-group">
                  <label>Provide a description for the Checklist:</label>
                  <input
                    class="form-control"
                    type="text"
                    field="description"
                    // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                    // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                    value={
                      this.state.checklistObject.metadata.description || ""
                    }
                    onChange={this.handleChecklistMetadataUpdate}
                  />
                </div>
              </form>
              {this.state.checklistObject.checklist_questions.map(
                (section, index) => {
                  return (
                    <div class="bordered">
                      <ChecklistSectionEditor
                        section={section}
                        sectionNum={index}
                        handleSectionUpdate={this.handleSectionUpdate}
                      ></ChecklistSectionEditor>
                      <button
                        section={index}
                        class="btn btn-danger btn-lg btn-block"
                        onClick={this.handleSectionDelete}
                      >
                        Delete this Section
                      </button>
                      {index !== 0 && (
                        <button
                          section={index}
                          move="up"
                          class="btn btn-danger btn-lg btn-block"
                          onClick={this.handleSectionMove}
                        >
                          Move this section up
                        </button>
                      )}
                      {index !==
                        this.state.checklistObject.checklist_questions.length -
                          1 && (
                        <button
                          section={index}
                          move="down"
                          class="btn btn-danger btn-lg btn-block"
                          onClick={this.handleSectionMove}
                        >
                          Move this section down
                        </button>
                      )}
                    </div>
                  );
                }
              )}
              <button
                class="btn btn-danger btn-lg btn-block"
                onClick={this.handleSectionAdd}
              >
                Add a new Section
              </button>
              <button
                class="btn btn-danger btn-lg btn-block"
                onClick={this.saveChecklist}
              >
                Save checklist to server
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

//withrouter so that can pass in details via a separate route
export default withRouter(ChecklistEditor);
