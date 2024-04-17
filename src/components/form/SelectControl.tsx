"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import type { SelectProps } from "antd";
import debounce from "lodash.debounce";
import { Control, useController } from "react-hook-form";
export interface SelectControlProps {
  name: string;
  label: string;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  data: { label: string; value: string; description?: string }[];
  handleSearchSelect: (value: string) => void;
  control: Control<any>;
  allowClear?: boolean;
  isRequired?: boolean;
  onClear?: () => void;
  disabled?: boolean;
}

export function SelectControl({
  placeholder,
  style,
  debounceSeconds,
  data = [],
  handleSearchSelect,
  name,
  control,
  isRequired,
  onClear,
  label,
  allowClear = true,
  disabled,
}: SelectControlProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });

  const handleSearch = (newValue: string) => {
    if (newValue) handleSearchSelect(newValue);
  };

  const handleChange = (e: string) => {
    onChange(e);
  };

  return (
    <Autocomplete
      isDisabled={disabled}
      // defaultInputValue={defaultInputValue}
      ref={ref}
      size="lg"
      isRequired={isRequired}
      onInputChange={debounce(handleSearch, debounceSeconds || 300)}
      onSelectionChange={(e) => {
        handleChange(e?.toString() || "");
      }}
      labelPlacement="inside"
      // defaultInputValue={value}
      isClearable={allowClear}
      selectedKey={value}
      label={label || "Tìm kiếm"}
      placeholder={placeholder}
      onKeyDown={(e: any) => e.continuePropagation()}
      className="max-w-2xl w-full"
    >
      {data?.map(
        (item) =>
          (
            <AutocompleteItem
              key={item.value || ""}
              value={item?.value || ""}
              textValue={item?.label?.toString() || ""}
            >
              {item.label}
              {item?.description && (
                <div className="mt-1 text-sm text-gray-800">
                  {item?.description}
                </div>
              )}
            </AutocompleteItem>
          ) || []
      )}
    </Autocomplete>
  );
}
