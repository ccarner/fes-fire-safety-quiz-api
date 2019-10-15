import React from "react";
import { Link, Redirect } from "react-router-dom";
import ContentPage from "./contentPage";
import QuizEditor from "./quizEditor.jsx";

class QuizPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);

    this.state = {
      editingQuiz: undefined
    };
  }

  handleEdit(data) {
    console.log(data);
    this.setState({ editingQuiz: data });
    console.log("state", this.state);
  }

  render() {
    if (this.state.editingQuiz) {
      console.log("got here, should be linking...");
      return (
        <Redirect
          push
          to={{
            pathname: "/editQuiz",
            state: { quizEditing: this.state.editingQuiz }
          }}
        />
      );
      // return <QuizEditor editingQuiz={this.state.editingQuiz} />;
    } else {
      return (
        <React.Fragment>
          <ContentPage
            contentType="quiz"
            heading="Quizzes"
            handleEdit={this.handleEdit}
          />
          <Link to="/editQuiz">
            <button class="btn btn-primary btn-lg btn-block">
              Create a new Quiz
            </button>
          </Link>
        </React.Fragment>
      );
    }
  }
}

export default QuizPage;
