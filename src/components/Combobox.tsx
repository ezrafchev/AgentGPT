import { useState } from "react";
import { Combobox as ComboboxPrimitive } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import clsx from "clsx";

interface ComboboxProps {
  value: string;
  options: string[];
  left?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

interface ComboboxInputProps {
  className: string;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ComboboxOptionProps {
  className: string;
  value: string;
}

const ComboboxInput = ({ className, disabled, onChange }: ComboboxInputProps) => {
  return (
    <ComboboxPrimitive.Input
      className={className}
      disabled={disabled}
      onChange={onChange}
      data-testid="combobox-input"
      aria-label="Select an option"
    />
  );
};

const ComboboxOption = ({ className, value }: ComboboxOptionProps) => {
  return (
    <ComboboxPrimitive.Option
      className={className}
      value={value}
      data-testid={`combobox-option-${value}`}
      role="option"
      tabIndex={-1}
    >
      {value}
    </ComboboxPrimitive.Option>
  );
};

const Combobox = ({
  options,
  value,
  left = true,
  disabled,
  onChange,
}: ComboboxProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target instanceof HTMLInputElement &&
      typeof event.target.value === "string"
    ) {
      setQuery(event.target.value);
    }
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onChange(query);
    }
  };

  const handleInputBlur = () => {
    setQuery("");
  };

  const handleInputFocus = () => {
    setQuery(value);
  };

  const handleButtonClick = () => {
    setQuery("");
  };

  const filteredOptions =
    query === ""
      ? options
      : options.filter((opt) => {
          return opt.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <ComboboxPrimitive value={value
