import React from "react";

const ButtonSpinner = () => {
  return (
    <button className="btn bg-primary-subtle" type="button" disabled>
      <span
        className="spinner-border spinner-border-sm"
        aria-hidden="true"
      ></span>
      <span role="status">Loading...</span>
    </button>
  );
};

export default ButtonSpinner;
