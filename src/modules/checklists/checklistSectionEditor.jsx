import React from "react";
import ChecklistQuestionEditor from "./checklistQuestionEditor.jsx";

/* used by checklistEditor to edit a single section. A stateless component */
class ChecklistSectionEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleQuestionUpdate = this.handleQuestionUpdate.bind(this);
    this.handleQuestionDelete = this.handleQuestionDelete.bind(this);
    this.handleQuestionMove = this.handleQuestionMove.bind(this);
    this.handleQuestionAdd = this.handleQuestionAdd.bind(this);
    this.createSectionCopy = this.createSectionCopy.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    this.emptyQuestion = {
      question: "Type question here",
      help_text: "Type help text here",
      media: "text",
      media_src: ""
    };
  }

  //used to make copy of the prop so can edit it and return for updating
  //doesn't make a deep copy!
  createSectionCopy() {
    var modifiedSection = { ...this.props.section }; // creating copy of prop
    modifiedSection.questions = [...this.props.section.questions]; // create shallow copy, the questions are themselves objects...
    return modifiedSection;
  }

  /* a property of the section was updated (eg section name), pass it up to the checklistEditor*/
  handleUpdate(event) {
    event.preventDefault();
    var modifiedSection = this.createSectionCopy(); // creating copy of prop
    // event.target returns a DOM element, use getAttribute to get the attribute (value and id and possibly name are automatically mapped
    // so can just say event.target.value)
    modifiedSection[event.target.getAttribute("field")] = event.target.value; // update the name property, assign a new value
    this.props.handleSectionUpdate(this.props.sectionNum, modifiedSection);
  }

  /* question was updated, pass it up to the checklistEditor*/
  handleQuestionUpdate(questionNumber, newQuestion) {
    let newSection = this.createSectionCopy(); // creating copy of state variable
    newSection.questions[questionNumber] = newQuestion;
    this.props.handleSectionUpdate(this.props.sectionNum, newSection);
  }

  /* question was deleted, pass it up to the checklistEditor*/
  handleQuestionDelete(event) {
    event.preventDefault();
    let questionNumber = event.target.getAttribute("questionindex");

    let newSection = this.createSectionCopy(); // creating copy of state variable

    newSection.questions.splice(questionNumber, 1);
    this.props.handleSectionUpdate(this.props.sectionNum, newSection);
  }

  /* question was moved, pass it up to the checklistEditor*/
  handleQuestionMove(event) {
    event.preventDefault();
    let questionNumber = parseInt(event.target.getAttribute("question"));
    let sectionNumber = event.target.getAttribute("section");
    var swapQuestionNumber;
    if (event.target.getAttribute("move") === "down") {
      swapQuestionNumber = questionNumber + 1;
    } else {
      swapQuestionNumber = questionNumber - 1;
    }
    this.setState(prevState => {
      let checklistObject = { ...prevState.checklistObject };
      //temp copy to make the swap
      var temp =
        checklistObject["checklist_questions"][sectionNumber]["questions"][
          questionNumber
        ];

      checklistObject["checklist_questions"][sectionNumber]["questions"][
        questionNumber
      ] =
        checklistObject["checklist_questions"][sectionNumber]["questions"][
          swapQuestionNumber
        ];

      checklistObject["checklist_questions"][sectionNumber]["questions"][
        swapQuestionNumber
      ] = temp;

      return { checklistObject }; // return new object
    });
  }

  /* question was added, pass it up to the checklistEditor*/
  handleQuestionAdd(event) {
    event.preventDefault();
    let newSection = this.createSectionCopy(); // creating copy of state variable
    var newQuestion = { ...this.emptyQuestion };

    newSection.questions.push(newQuestion);
    this.props.handleSectionUpdate(this.props.sectionNum, newSection);
  }

  render() {
    return (
      <div>
        {/* need to add + 1 since questionNum starts at 0 */}
        <h3> Section #{this.props.sectionNum + 1} </h3>

        <div class="form-group">
          <label>Provide the name of this section:</label>
          <input
            class="form-control"
            type="text"
            field="section_name"
            // Added the || "" in the 'value' attribute to prevent component becoming uncontrolled when question is initially null:
            // Qas getting error  A component is changing an uncontrolled input of type text to be controlled
            value={this.props.section.section_name || ""}
            onChange={this.handleUpdate}
          />

          {this.props.section.questions.map((q, index) => {
            return (
              <div class="bordered">
                <ChecklistQuestionEditor
                  handleQuestionUpdate={this.handleQuestionUpdate}
                  questionNum={index}
                  question={q}
                ></ChecklistQuestionEditor>
                <div class="col ">
                  <button
                    type="deleteQuestion"
                    questionindex={index}
                    class="btn btn-danger btn-lg btn-block"
                    onClick={this.handleQuestionDelete}
                  >
                    Delete this Question
                  </button>
                </div>
              </div>
            );
          })}

          <button
            type="addQuestion"
            class="btn btn-danger btn-lg btn-block"
            onClick={this.handleQuestionAdd}
          >
            Add a Question
          </button>
        </div>
      </div>
    );
  }
}

export default ChecklistSectionEditor;
