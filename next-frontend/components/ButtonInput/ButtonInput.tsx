import { forwardRef, MouseEventHandler } from "react";

interface IButtonInputProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  value?: string;
  isLoading: boolean;
}

const ButtonInput = forwardRef<HTMLButtonElement, IButtonInputProps>(
  ({ value, onClick, isLoading }, ref) => (
    <button
      className={`button is-link is-fullwidth mb-5${
        isLoading ? " is-loading" : ""
      }`}
      onClick={onClick}
      ref={ref}
    >
      {value}
    </button>
  )
);

ButtonInput.displayName = "ButtonInput";

export default ButtonInput;
