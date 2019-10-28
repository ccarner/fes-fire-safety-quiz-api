import React from "react";
import { Link, Redirect } from "react-router-dom";
import ContentPage from "./contentPage";

/* page for viewing quizzes on server/ uploading new ones, or creating/editing them. 
The component is a container for a Content Page and additional components/configs like
how that content page should handleEdit + button to 'create' a quiz etc */
class QuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.state = {
      editingQuiz: undefined
    };
  }
  // set that we want to edit a quiz (data)
  handleEdit(data) {
    this.setState({ editingQuiz: data });
  }

  render() {
    if (this.state.editingQuiz) {
      // change to editing url, with the quiz as state to location
      return (
        <Redirect
          push
          to={{
            pathname: "/editQuiz",
            state: { quizEditing: this.state.editingQuiz }
          }}
        />
      );
    } else {
      return (
        <React.Fragment>
          <ContentPage
            contentType="quiz"
            heading="Quizzes"
            handleEdit={this.handleEdit}
          />
          <Link to="/editQuiz">
            <button class="btn menu-btn btn-danger btn-lg ">
              Create a new Quiz
            </button>
          </Link>
        </React.Fragment>
      );
    }
  }
}

export default QuizPage;
