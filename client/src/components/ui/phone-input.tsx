import React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string;
  onChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Only allow digits and limit to 10 characters
      const numericValue = inputValue.replace(/\D/g, "").slice(0, 10);
      onChange?.(numericValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow only numbers, backspace, delete, and arrow keys
      if (
        !/\d/.test(e.key) &&
        !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={value || ""}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        maxLength={10}
        placeholder="Enter 10 digit mobile number"
        className={cn(className)}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };