import React from "react";
import { Link, Redirect } from "react-router-dom";
import ContentPage from "./contentPage";

/* page for viewing checklists on server/ uploading new ones, or creating/editing them. 
The component is a container for a Content Page and additional components/configs like
how that content page should handleEdit + button to 'create' a checklist etc */
class ChecklistPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editingChecklist: undefined
    };
  }

  // set that we want to edit a checklist (data)
  handleEdit(data) {
    this.setState({ editingChecklist: data });
  }

  render() {
    if (this.state.editingChecklist) {
      // change to editing url, with the checklist as state to location
      return (
        <Redirect
          push
          to={{
            pathname: "/editChecklist",
            state: { checklistEditing: this.state.editingChecklist }
          }}
        />
      );
    } else {
      return (
        <React.Fragment>
          <ContentPage
            contentType="checklist"
            heading="Checklists"
            handleEdit={this.handleEdit}
          />
          <Link to="/editChecklist">
            <button class="btn menu-btn btn-danger btn-lg ">
              Create a new Checklist
            </button>
          </Link>
        </React.Fragment>
      );
    }
  }
}

export default ChecklistPage;
