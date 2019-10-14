import React from "react";

class QuizQuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate(event) {
    var modifiedQuestion = { ...this.props.question }; // creating copy of prop
    // event.target returns a DOM element, use getAttribute to get the attribute (value and id and possibly name are automatically mapped
    // so can just say event.target.value)
    modifiedQuestion[event.target.getAttribute("field")] = event.target.value; // update the name property, assign a new value
    console.log(modifiedQuestion);
    this.props.handleUpdate(this.props.questionNum, modifiedQuestion);
  }

  render() {
    return (
      <React.Fragment>
        <div>
          Type the question text:
          <input
            type="text"
            field="question"
            value={this.props.question.question}
            onChange={this.handleUpdate}
          />
          Select the media type for the question:
          <select
            value={this.props.question.media}
            onChange={this.handleUpdate}
            field="media"
          >
            <option value="text">No Media (text only)</option>
            <option value="video">Video</option>
            <option value="img">Image</option>
          </select>
        </div>
      </React.Fragment>
    );
  }
}

export default QuizQuestionEditor;
