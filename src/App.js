import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Progress } from "reactstrap";
import "./App.css";
import axios from "axios";
import UploadFileComponent from "./UploadFileComponent.js";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1> upload quizzes here</h1>
        <UploadFileComponent uploadURL="http://localhost:8000/content/quizzes"></UploadFileComponent>

        <h1> upload modules here</h1>
        <UploadFileComponent uploadURL="http://localhost:8000/content/modules"></UploadFileComponent>

        <h1> upload checklists here</h1>
        <UploadFileComponent uploadURL="http://localhost:8000/content/checklists"></UploadFileComponent>
      </React.Fragment>
    );
  }
}

export default App;
