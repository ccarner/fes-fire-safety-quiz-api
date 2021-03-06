import React from "react";
import { Link } from "react-router-dom";

/* homepage of the application */
class Home extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-4 offset-md-4 ">
              <h1> File Entry System </h1>
              <Link to="/quizzes">
                {/* note implementing buttons using reactRouter way snappier than doing a link <a> and styling as a button, since reloads WHOLE app, not just some components (eg navbar) */}
                <button class="btn menu-btn btn-danger btn-lg btn-block">
                  View & Edit Quizzes
                </button>
              </Link>
              <Link to="/modules">
                <button class="btn menu-btn btn-danger btn-lg btn-block">
                  View & Edit Modules
                </button>
              </Link>
              <Link to="/media">
                <button class="btn menu-btn btn-danger btn-lg btn-block">
                  View & Edit Media
                </button>
              </Link>
              <Link to="/checklists">
                <button class="btn menu-btn btn-danger btn-lg btn-block">
                  View & Edit Checklists
                </button>
              </Link>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
