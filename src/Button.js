import React from 'react';

const Button = ({label, onClick}) => {
  return (
    <button
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  )
};

export default Button;
