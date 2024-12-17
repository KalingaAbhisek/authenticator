import React from 'react';
import './Spinner.css'; // Import the CSS for the spinner

const Spinner = () => {
  return (
    <div className="loading-spinner">
      <div className="loading-circle"></div>
    </div>
  );
};

export default Spinner;