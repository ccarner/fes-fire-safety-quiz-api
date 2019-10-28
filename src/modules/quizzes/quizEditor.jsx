import React from "react";
import QuizQuestionEditor from "./quizQuestionEditor.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Config } from "../../utils";
import { uploadFiles } from "../../utils";
import { withRouter } from "react-router";

/* Entry class for creating/ editing a quiz. Single source of truth for quiz state*/
class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuestionUpdate = this.handleQuestionUpdate.bind(this);
    this.addNewQuestion = this.addNewQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);
    this.handleQuestionDelete = this.handleQuestionDelete.bind(this);
    this.handleQuestionMove = this.handleQuestionMove.bind(this);
    this.handleQuizMetadataUpdate = this.handleQuizMetadataUpdate.bind(this);
    // template for when a new question is added
    this.emptyQuestion = {
      question: "Type Question Here",
      answer_index: [0, 1, 2, 3],
      media: "text",
      media_src: "",
      answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
      max_choices: 4
    };

    // this component can be used for editing an existing quiz or creating a new one
    try {
      // for 'editing' an existing quiz
      this.state = { quizObject: this.props.location.state.quizEditing };
    } catch (err) {
      // making a new one instead...
      this.state = {
        quizObject: {
          quiz_questions: [],
          metadata: {
            title: "New Quiz",
            description: "New quiz Description"
          }
        }
      };
    }
  }

  //question was modified, update it
  handleQuestionUpdate(questionNumber, newQuestion) {
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject }; // creating copy of state variable
      quizObject["quiz_questions"][questionNumber] = newQuestion; // update the name property, assign a new value
      return { quizObject }; // return new object
    });
  }

  //question was deleted, update state
  handleQuestionDelete(event) {
    let questionNumber = event.target.getAttribute("question");
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject };

      //remove question from the array
      quizObject["quiz_questions"].splice(questionNumber, 1);

      return { quizObject }; // return new object
    });
  }

  //question was moved, update state
  handleQuestionMove(event) {
    let questionNumber = parseInt(event.target.getAttribute("question"));
    var swapQuestionNumber;
    if (event.target.getAttribute("move") === "down") {
      swapQuestionNumber = questionNumber + 1;
    } else {
      swapQuestionNumber = questionNumber - 1;
    }

    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject };
      //swap the questions, need a temp var
      var temp = quizObject.quiz_questions[questionNumber];

      quizObject.quiz_questions[questionNumber] =
        quizObject.quiz_questions[swapQuestionNumber];

      quizObject.quiz_questions[swapQuestionNumber] = temp;

      return { quizObject }; // return new object
    });
  }

  // new question added, update state
  addNewQuestion() {
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject }; // creating copy of state variable
      // need to create a new quiz object which is a DEEP COPY of the empty question template...
      var newQuestion = { ...this.emptyQuestion };
      newQuestion.answer_index = [...this.emptyQuestion.answer_index];
      newQuestion.answers = [...this.emptyQuestion.answers];

      quizObject.quiz_questions.push(newQuestion);
      return { quizObject }; // return new object
    });
  }

  //save quiz to server
  saveQuiz() {
    var f = new File(
      [JSON.stringify(this.state.quizObject)],
      this.state.quizObject.metadata.title + ".json",
      {
        type: "application/json"
      }
    );
    var contentUrl = Config.getUrl("quiz");

    uploadFiles([f], contentUrl, undefined)
      .then(res => {
        toast.success("upload success");
      })
      .catch(err => {
        console.error(err);
        toast.error("upload fail");
      });
  }

  // update fields which don't require a deep copy (ie only title and description)
  handleQuizMetadataUpdate(event) {
    // event.persist();
    var value = event.target.value;
    var field = event.target.getAttribute("field");
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject }; // creating copy of state variable
      quizObject.metadata = { ...prevState.quizObject.metadata };
      // need to create a new quiz object which is a DEEP COPY of the empty question template...
      quizObject.metadata[field] = value;
      return { quizObject }; // return new object
    });
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <h1> Edit Quiz </h1>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-8 offset-md-2">
              <form class="form bordered">
                <h3> Title + Description</h3>
                <div class="form-group">
                  <label>Provide a title for the Quiz:</label>
                  <input
                    class="form-control"
                    type="text"
                    field="title"
                    // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                    // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                    value={this.state.quizObject.metadata.title || ""}
                    onChange={this.handleQuizMetadataUpdate}
                  />
                </div>
                <div class="form-group">
                  <label>Provide a description for the Quiz:</label>
                  <input
                    class="form-control"
                    type="text"
                    field="description"
                    // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                    // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                    value={this.state.quizObject.metadata.description || ""}
                    onChange={this.handleQuizMetadataUpdate}
                  />
                </div>
              </form>
              {this.state.quizObject.quiz_questions.map((quest, index) => {
                return (
                  <div class="bordered">
                    <QuizQuestionEditor
                      question={quest}
                      questionNum={index}
                      handleUpdate={this.handleQuestionUpdate}
                      handleDelete={this.handleQuestionDelete}
                    ></QuizQuestionEditor>
                    <button
                      question={index}
                      class="btn btn-danger btn-lg btn-block"
                      onClick={this.handleQuestionDelete}
                    >
                      Delete this Question
                    </button>
                    {index !== 0 && (
                      <button
                        question={index}
                        move="up"
                        class="btn btn-danger btn-lg btn-block"
                        onClick={this.handleQuestionMove}
                      >
                        Move this question up
                      </button>
                    )}
                    {index !==
                      this.state.quizObject.quiz_questions.length - 1 && (
                      <button
                        question={index}
                        move="down"
                        class="btn btn-danger btn-lg btn-block"
                        onClick={this.handleQuestionMove}
                      >
                        Move this question down
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                class="btn btn-danger btn-lg btn-block"
                onClick={this.addNewQuestion}
              >
                Add a new question
              </button>
              <button
                class="btn btn-danger btn-lg btn-block"
                onClick={this.saveQuiz}
              >
                Save quiz to server
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

//withrouter so that can pass in details via a separate route
export default withRouter(QuizEditor);
