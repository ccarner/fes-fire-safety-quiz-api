import React from "react";
import { Link, Redirect } from "react-router-dom";
import ContentPage from "./contentPage";
import ChecklistEditor from "./checklistEditor.jsx";

class ChecklistPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);

    this.state = {
      editingChecklist: undefined
    };
  }

  handleEdit(data) {
    console.log(data);
    this.setState({ editingChecklist: data });
    console.log("state", this.state);
  }

  render() {
    if (this.state.editingChecklist) {
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
            <button class="btn btn-primary btn-lg btn-block">
              Create a new Checklist
            </button>
          </Link>
        </React.Fragment>
      );
    }
  }
}

export default ChecklistPage;
