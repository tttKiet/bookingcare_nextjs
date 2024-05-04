"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import type { SelectProps } from "antd";
import debounce from "lodash.debounce";
import { ReactNode, useCallback } from "react";
import { Control, useController } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { SelecSearchOptionProps } from "./select-field-search";
export interface SelectControlProps {
  name: string;
  label: string | ReactNode;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  data: SelecSearchOptionProps[];
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
  classLabel?: string;
  allowsEmptyCollection?: boolean;
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
  allowsEmptyCollection,
  label,
  allowClear = true,
  disabled,
  labelPlacement,
  onChangeParent,
  variant,
  endContent,
  classLabel,
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
    if (typeof newValue == "string" && handleSearchSelect) {
      handleSearchSelect(newValue);
    }
  };

  const handleChange = (e: string) => {
    if (onChangeParent) {
      onChangeParent(e);
    }
    onChange(e);
  };

  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    // normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    textValue = textValue
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLocaleLowerCase();

    const wordsToSearch = inputValue
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const wordConditions = wordsToSearch.every((word) =>
      textValue.includes(word)
    );
    return wordConditions;
  };

  return (
    <div>
      <Autocomplete
        isDisabled={disabled}
        defaultFilter={myFilter}
        endContent={endContent}
        variant={variant}
        // defaultInputValue={value || ""}
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
        // value={value}

        defaultSelectedKey={value || ""}
        selectedKey={value}
        labelPlacement={labelPlacement || "inside"}
        isClearable={allowClear}
        placeholder={placeholder}
        onKeyDown={(e: any) => e.continuePropagation()}
        className="max-w-2xl w-full"
        allowsEmptyCollection={allowsEmptyCollection}
      >
        {data?.map(
          (item) =>
            (
              <AutocompleteItem
                key={item.value || ""}
                value={item?.value || ""}
                textValue={item?.label?.toString() || ""}
                startContent={item?.startContent}
              >
                <div className={classLabel}> {item.label}</div>
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
