"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import type { SelectProps } from "antd";
import debounce from "lodash.debounce";
export interface SelectSearchFieldProps {
  title?: string;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  value: string | null | undefined;
  data: SelectProps["options"];
  handleSearchSelect: (value: string) => void;
  handleChangeSelect: (value: string) => void;
  allowClear?: boolean;
  isRequired?: boolean;
}

export function SelectSearchField({
  placeholder,
  style,
  debounceSeconds,
  data,
  handleSearchSelect,
  handleChangeSelect,
  value,
  isRequired = true,
  title,
  allowClear = true,
}: SelectSearchFieldProps) {
  const handleSearch = (newValue: string) => {
    if (newValue) handleSearchSelect(newValue);
  };

  const handleChange = (e: string) => {
    handleChangeSelect(e);
  };

  const dataResult =
    data?.map((d) => ({
      value: d.value?.toString() || "",
      label: d.label,
    })) || [];

  return (
    <Autocomplete
      allowsEmptyCollection
      value={value ?? ""}
      onInputChange={debounce(handleSearch, debounceSeconds || 300)}
      onSelectionChange={(e) => {
        handleChange(e?.toString() || "");
      }}
      label={
        <>
          {title} {isRequired && <span className="text-red-400">*</span>}
        </>
      }
      labelPlacement="inside"
      defaultInputValue={value || ""}
      isClearable={allowClear}
      placeholder={placeholder}
      onKeyDown={(e: any) => e.continuePropagation()}
      className="max-w-2xl w-full"
    >
      {dataResult.map((item) => (
        <AutocompleteItem
          key={item.value || ""}
          value={item?.value || ""}
          textValue={item?.value || ""}
        >
          {item.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
