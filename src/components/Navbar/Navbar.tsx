import React from 'react';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar  bg-primary-subtle mb-5">
        <div className="container d-flex justify-content-center">
          <a className="navbar-brand text-white fs-1 fw-bold" href="#">TODO List</a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;