import React from 'react'
import './Button.css';
// default button component

const Button = ({ action, label, type }) => {
    return (
      <button className={`btn ${type || 'default'}`} onClick={action}>{label || 'Default'}</button>
    );
}

export default Button;