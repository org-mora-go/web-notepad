"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  ariaLabel: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function SearchField({
  value,
  ariaLabel,
  placeholder,
  onChange,
}: Props) {
  return (
    <label className="search-field">
      <Search size={15} aria-hidden="true" />
      <input
        type="search"
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
