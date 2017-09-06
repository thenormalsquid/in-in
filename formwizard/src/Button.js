import React from 'react'
import './Button.css';
// default button component

const Button = ({ action, label, type, value }) => {
    // action calls value
    const clickHandler = e => {
        e.preventDefault();
        action(value);
    };
    return (
      <button className={`btn ${type || 'default'}`} onClick={clickHandler}>{label || 'Default'}</button>
    );
}

export default Button;