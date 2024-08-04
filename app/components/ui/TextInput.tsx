import React from "react";

interface TextInputProps {
  label: string;
  name: string;
  placeholder: string;
  error?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder,
  error,
}) => {
  return (
    <label className="flex flex-col text-white">
      {label}:
      <input
        className="mt-1 rounded-md p-2 text-sm text-black"
        placeholder={placeholder}
        type="text"
        name={name}
        aria-describedby={`${name}-error`}
      />
      {error && (
        <span id={`${name}-error`} className="mt-4 text-red-500">
          {error}
        </span>
      )}
    </label>
  );
};

export default TextInput;
