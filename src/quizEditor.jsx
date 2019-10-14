class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    // this.handleView = this.handleView.bind(this);

    this.state = {
      quizObject: {
        quiz_questions: [],
        title: "New Quiz",
        description: "New quiz Description"
      }
    };
  }

  handleTextInputChange(event) {
    this.setState({ quiz_questions.[event.target.id]: this.state.question.question });
    this.setState(prevState => {
      let questions = { ...prevState.questions };        // creating copy of state variable 
      jasper.name = 'someothername';                     // update the name property, assign a new value                 
      return { jasper };                                 // return new object
    })
  }
  
  addNewQuestion() {
    this.setState({ quiz_questions: this.state.quiz_questions.push({}) });
  }

  render() {
    return (
      <React.Fragment>
        {/* note implementing buttons using reactRouter way snappier than doing a link <a> and styling as a button, since reloads WHOLE app, not just some components (eg navbar) */}
        {this.state.quiz_question.map(quest => {
          <quizQuestionEditor question={quest}></quizQuestionEditor>;
        })}
        <button
          class="btn btn-primary btn-lg btn-block"
          onClick={this.addNewQuestion()}
        >
          Add a new question
        </button>
      </React.Fragment>
    );
  }
}
