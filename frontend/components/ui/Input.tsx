import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block font-title-sm text-xs text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={`w-full h-11 bg-surface-container border border-border-subtle rounded-lg px-4 font-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors ${
          error ? "border-error focus:border-error" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-error font-body-sm">{error}</p>}
    </div>
  );
}

export default Input;
