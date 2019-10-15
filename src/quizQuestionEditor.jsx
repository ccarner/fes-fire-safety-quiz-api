import React from "react";

class QuizQuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdateAnswers = this.handleUpdateAnswers.bind(this);
    this.handleDeleteAnswer = this.handleDeleteAnswer.bind(this);
    this.handleAddAnswer = this.handleAddAnswer.bind(this);
    this.createQuestionDeepCopy = this.createQuestionDeepCopy.bind(this);
  }

  //used to make copy of the prop so can edit it and return for updating
  createQuestionDeepCopy() {
    var modifiedQuestion = { ...this.props.question }; // creating copy of prop
    modifiedQuestion.answers = [...this.props.question.answers]; // create deep copy
    modifiedQuestion.answer_index = [...this.props.question.answer_index]; // create deep copy
    return modifiedQuestion;
  }

  handleUpdate(event) {
    var modifiedQuestion = this.createQuestionDeepCopy(); // creating copy of prop
    // event.target returns a DOM element, use getAttribute to get the attribute (value and id and possibly name are automatically mapped
    // so can just say event.target.value)
    modifiedQuestion[event.target.getAttribute("field")] = event.target.value; // update the name property, assign a new value
    this.props.handleUpdate(this.props.questionNum, modifiedQuestion);
  }

  handleDeleteAnswer(event) {
    // button inside of form, don't want to 'submit' it, so need to preventDEfault
    event.preventDefault();
    let answerIndex = parseInt(event.target.getAttribute("answerindex"), 10);
    //remove question from the array

    var modifiedQuestion = this.createQuestionDeepCopy();
    modifiedQuestion.answers.splice(answerIndex, 1);

    // rebuild answer index
    var newAnswerIndex = [];
    for (var i = 0; i < modifiedQuestion.answer_index.length; i++) {
      //don't assume that answers are ordered, eg could be [2,3,1]
      //remove correct answer if it was in there. +1 since answer numbers start at 1 in the json format
      if (modifiedQuestion.answer_index[i] > answerIndex + 1) {
        // decrement by one when pushing in, since deleted an answer below it
        // eg answer #1 is deleted, answer #2 becomes answer#1, so need to change the
        // value in answer_index from '2' to '1'
        newAnswerIndex.push(modifiedQuestion.answer_index[i] - 1);
      } else if (modifiedQuestion.answer_index[i] !== answerIndex + 1) {
        // don't include the answer for the deleted question, and put everything else back in
        newAnswerIndex.push(modifiedQuestion.answer_index[i]);
      }
    }
    modifiedQuestion.answer_index = newAnswerIndex;

    this.props.handleUpdate(this.props.questionNum, modifiedQuestion);
  }

  handleUpdateAnswers(event) {
    var modifiedQuestion = this.createQuestionDeepCopy();
    // event.target returns a DOM element, use getAttribute to get the attribute (value and id and possibly name are automatically mapped
    // so can just say event.target.value)
    let answerindex = parseInt(event.target.getAttribute("answerindex"), 10);
    if (event.target.getAttribute("field") === "answer") {
      modifiedQuestion.answers[answerindex] = event.target.value;
    } else if (event.target.getAttribute("field") === "correctAnswer") {
      console.log("in correctAns", event.target.checked);
      if (event.target.checked === true) {
        // push answer index +1 since answers start at 1 in the quiz format...
        modifiedQuestion.answer_index.push(answerindex + 1);
      } else if (event.target.checked === false) {
        // remove the answer index from the list of correct answers
        // need to find index inside answer_index of the answer first
        var index = modifiedQuestion.answer_index.indexOf(answerindex + 1);
        if (index !== -1) modifiedQuestion.answer_index.splice(index, 1);
      }
    }
    this.props.handleUpdate(this.props.questionNum, modifiedQuestion);
    console.log(modifiedQuestion);
  }

  handleAddAnswer(event) {
    event.preventDefault();
    var modifiedQuestion = this.createQuestionDeepCopy();
    modifiedQuestion.answers.push("New Answer Option");
    this.props.handleUpdate(this.props.questionNum, modifiedQuestion);
  }

  render() {
    return (
      <div>
        {/* need to add + 1 since questionNum starts at 0 */}
        <h3> Question #{this.props.questionNum + 1} </h3>
        <form class="form-group">
          <div class="form-group">
            <label>Provide the question text:</label>
            <input
              class="form-control"
              type="text"
              field="question"
              // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
              // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
              value={this.props.question.question || ""}
              onChange={this.handleUpdate}
            />
          </div>
          <div class="form-group">
            <label>Select the media type for the question:</label>
            <select
              class="form-control"
              value={this.props.question.media || ""}
              onChange={this.handleUpdate}
              field="media"
            >
              <option value="text">No Media (text only)</option>
              <option value="video">Video</option>
              <option value="img">Image</option>
            </select>
          </div>
          {this.props.question.media !== "text" && (
            <div class="form-group">
              <label>Provide the URL of selected media:</label>
              <input
                class="form-control"
                type="text"
                field="media_src"
                // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                value={this.props.question.media_src || ""}
                onChange={this.handleUpdate}
              />
            </div>
          )}
          {this.props.question.answers.map((ans, index) => {
            return (
              <React.Fragment>
                <div class="form-group row">
                  <div class="col col-md-8 ">
                    <label>Provide answer option #{index + 1}</label>
                    <input
                      class="form-control"
                      type="text"
                      field="answer"
                      answerindex={index}
                      // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
                      // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
                      value={this.props.question.answers[index] || ""}
                      onChange={this.handleUpdateAnswers}
                    />
                  </div>
                  <label class="col col-sm-1">Is this a correct answer?</label>
                  <div class="col col-sm-1">
                    <input
                      id="answerCorrectCheckbox"
                      class="form-control"
                      type="checkbox"
                      field="correctAnswer"
                      answerindex={index}
                      checked={this.props.question.answer_index.includes(
                        index + 1
                      )}
                      onChange={this.handleUpdateAnswers}
                    />
                  </div>
                  <div class="col col-sm-2">
                    <button
                      type="deleteAnswer"
                      answerindex={index}
                      class="btn btn-primary btn-lg btn-block"
                      onClick={this.handleDeleteAnswer}
                    >
                      Delete this answer
                    </button>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
          <button
            type="addAnswer"
            class="btn btn-primary btn-lg btn-block"
            onClick={this.handleAddAnswer}
          >
            Add an Answer
          </button>
        </form>
      </div>
    );
  }
}

export default QuizQuestionEditor;
