"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import type { SelectProps } from "antd";
import debounce from "lodash.debounce";
import { ReactNode } from "react";
import { Control, useController } from "react-hook-form";
export interface SelectControlProps {
  name: string;
  label: string | ReactNode;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  data: { label: string; value: string; description?: string }[];
  handleSearchSelect?: (value: string) => void;
  control: Control<any>;
  allowClear?: boolean;
  isRequired?: boolean;
  onClear?: () => void;
  disabled?: boolean;
  labelPlacement?: "inside" | "outside" | "outside-left" | undefined;
  variant?: "flat" | "faded" | "bordered" | "underlined" | undefined;
  onChangeParent?: (value: string) => void;
  endContent?: ReactNode;
  color?:
    | "default"
    | "secondary"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
}

export function SelectControl({
  placeholder,
  style,
  debounceSeconds,
  data = [],
  handleSearchSelect,
  name,
  control,
  isRequired = true,
  onClear,
  label,
  allowClear = true,
  disabled,
  labelPlacement,
  onChangeParent,
  variant,
  endContent,
  color,
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
    if (newValue && handleSearchSelect) handleSearchSelect(newValue);
  };

  const handleChange = (e: string) => {
    if (onChangeParent) {
      onChangeParent(e);
    }
    onChange(e);
  };

  return (
    <div>
      <Autocomplete
        isDisabled={disabled}
        endContent={endContent}
        variant={variant}
        // defaultInputValue={defaultInputValue}
        ref={ref}
        size="lg"
        onInputChange={debounce(handleSearch, debounceSeconds || 300)}
        onSelectionChange={(e) => {
          handleChange(e?.toString() || "");
        }}
        color={
          color || error?.message
            ? "danger"
            : isSubmitted
            ? "primary"
            : "default"
        }
        label={
          <span className="flex items-center gap-1">
            {label} {isRequired && <span className="text-red-400">*</span>}
          </span>
        }
        defaultSelectedKey={value}
        labelPlacement={labelPlacement || "inside"}
        isClearable={allowClear}
        selectedKey={value}
        // label={label || "Tìm kiếm"}
        placeholder={placeholder}
        onKeyDown={(e: any) => e.continuePropagation()}
        className="max-w-2xl w-full"
        allowsEmptyCollection
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
      <p className="text-sm mt-[2px] text-danger-500">{error?.message}</p>
    </div>
  );
}
