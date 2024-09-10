import React from "react";
import { motion, MotionProps } from "framer-motion";
import "./button.css";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & MotionProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className="relative px-4 py-1 bg-yellow-300 text-black hover:bg-yellow-500 btn"
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
