import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="topbar">
        <div className="topbar__center">
          <Link to="/contacts" className="topbar__title">
            Your Contact Book
          </Link>
        </div>
      
    </header>
  );
}
