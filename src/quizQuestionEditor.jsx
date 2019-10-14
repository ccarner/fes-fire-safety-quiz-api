class QuizEditor extends React.Component {
  constructor(props) {
    super(props);
    // this.handleView = this.handleView.bind(this);
  }
  handleTextInputChange(event) {
    this.setState({ [event.target.id]: this.state.question.question });
  }

  getState() {
    return this.state;
  }

  render() {
    <input
      type="text"
      question_num={this.props.question_num}
      field="question"
      value={this.state.question}
      onChange={this.props.handleTextInputChange}
    />;
  }
}
