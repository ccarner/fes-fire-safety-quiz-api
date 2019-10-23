import React from "react";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

// a stateless functional component in react... since only from props etc
// pass props as arg and don't use 'this'
const NavBar = props => {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        <button type="button" class="btn btn-outline-danger">
          Home
        </button>
      </Link>
      <img alt="" width="75" src={logo} />
      <Link className="navbar-brand" to="/logout">
        <button type="button" class="btn btn-outline-danger">
          Logout
        </button>
      </Link>
    </nav>
  );
};

export default NavBar;
