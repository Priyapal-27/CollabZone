import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface NameInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
}

const NameInput = React.forwardRef<HTMLInputElement, NameInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Only allow letters and spaces
      const nameValue = inputValue.replace(/[^a-zA-Z\s]/g, "");
      onChange?.(nameValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow only letters, spaces, backspace, delete, and arrow keys
      if (
        !/[a-zA-Z\s]/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        value={value || ""}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder="Enter your full name"
        className={cn(className)}
      />
    );
  }
);

NameInput.displayName = "NameInput";

export { NameInput };