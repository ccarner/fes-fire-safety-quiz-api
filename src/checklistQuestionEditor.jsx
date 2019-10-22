import React from "react";

class QuizQuestionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.createQuestionCopy = this.createQuestionCopy.bind(this);
  }

  //used to make copy of the prop so can edit it and return for updating
  createQuestionCopy() {
    var modifiedQuestion = { ...this.props.question }; // creating copy of prop
    return modifiedQuestion;
  }

  handleUpdate(event) {
    var modifiedQuestion = this.createQuestionCopy(); // creating copy of prop
    // event.target returns a DOM element, use getAttribute to get the attribute (value and id and possibly name are automatically mapped
    // so can just say event.target.value)
    modifiedQuestion[event.target.getAttribute("field")] = event.target.value; // update the name property, assign a new value
    this.props.handleQuestionUpdate(this.props.questionNum, modifiedQuestion);
  }

  render() {
    return (
      <div>
        {/* need to add + 1 since questionNum starts at 0 */}
        <h5> Question #{this.props.questionNum + 1} </h5>
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
            <label>Provide text for the help popup:</label>
            <input
              class="form-control"
              type="text"
              field="help_text"
              // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
              // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
              value={this.props.question.help_text || ""}
              onChange={this.handleUpdate}
            />
          </div>
          <div class="form-group">
            <label>Select the media type for the help popup:</label>
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
        </form>
      </div>
    );
  }
}

export default QuizQuestionEditor;
