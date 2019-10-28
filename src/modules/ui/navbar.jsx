import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

/* Navbar for the application. A stateless functional component */
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
