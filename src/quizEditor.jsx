import React from "react";
import QuizQuestionEditor from "./quizQuestionEditor.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Config from "./config.js";

class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuestionUpdate = this.handleQuestionUpdate.bind(this);
    this.addNewQuestion = this.addNewQuestion.bind(this);
    this.saveQuiz = this.saveQuiz.bind(this);

    this.state = {
      quizObject: {
        quiz_questions: [],
        title: "New Quiz",
        description: "New quiz Description"
      }
    };
  }

  handleQuestionUpdate(questionNumber, newQuestion) {
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject }; // creating copy of state variable
      quizObject["quiz_questions"][questionNumber] = newQuestion; // update the name property, assign a new value
      return { quizObject }; // return new object
    });
  }

  addNewQuestion() {
    this.setState(prevState => {
      let quizObject = { ...prevState.quizObject }; // creating copy of state variable
      quizObject.quiz_questions.push({});
      return { quizObject }; // return new object
    });
  }

  saveQuiz() {
    console.log("the file is:", JSON.stringify(this.state.quizObject));
    var f = new File([JSON.stringify(this.state.quizObject)], "test.json", {
      type: "application/json"
    });
    console.log(f);
    var contentUrl = Config.getUrl("quiz");
    const data = new FormData();
    for (var x = 0; x < f.length; x++) {
      data.append("file", f[x]);
    }
    axios
      .post(contentUrl, data, {
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
        console.log(err);
        toast.error("upload fail");
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.quizObject.quiz_questions.map((quest, index) => {
          return (
            <QuizQuestionEditor
              question={quest}
              questionNum={index}
              handleUpdate={this.handleQuestionUpdate}
            ></QuizQuestionEditor>
          );
        })}
        <button
          class="btn btn-primary btn-lg btn-block"
          onClick={this.addNewQuestion}
        >
          Add a new question
        </button>
        <button
          class="btn btn-primary btn-lg btn-block"
          onClick={this.saveQuiz}
        >
          Save quiz to server
        </button>
      </React.Fragment>
    );
  }
}

export default QuizEditor;
