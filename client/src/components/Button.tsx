import React from "react";
import "./Button.css";

type Props = { 
  className: string,
  text: string,
  type: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>
};

const Button: React.FC<Props> = ({ className, text, type, onClick }) => {
  return (
    <>
      <button 
        className = { className } 
        type = { type }
        onClick = { onClick } > { text } 
      </button>
    </>
  )
}

export default Button;