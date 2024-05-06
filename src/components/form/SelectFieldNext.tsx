"use client";

import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useEffect } from "react";
import { Control, useController } from "react-hook-form";

export interface SelectFieldNextProps {
  className?: string;
  name: string;
  label: string | React.ReactNode;
  control: Control<any>;
  icon?: React.ReactNode;
  width?: number | string;
  placeholder?: string;
  options: { label: string; value: string }[] | [];
  onChangeParent?: (e: Event) => void;
  debounceSeconds?: number;
  onSearchSelect?: (value: string) => void;
  disabled?: boolean;
  onChangeCustom?: (value: string) => void;
  isRequired?: boolean;
  isClearable?: boolean;
}

export function SelectFieldNext({
  name,
  label,
  control,
  className,
  options = [],
  icon,
  width,
  placeholder,
  onChangeParent,
  isRequired,
  debounceSeconds,
  onSearchSelect,
  onChangeCustom,
  isClearable,
  disabled = false,
}: SelectFieldNextProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });

  const defaultInputValue = options.find((o) => o.value === value)?.label;

  useEffect(() => {}, [defaultInputValue]);

  return (
    <Autocomplete
      name={name}
      selectedKey={value}
      // defaultInputValue={value}
      // inputValue={value}

      defaultInputValue={defaultInputValue}
      color={error?.message ? "danger" : isSubmitted ? "primary" : "default"}
      value={value}
      onSelectionChange={(e) => {
        const val: string = e?.toString() || "";
        if (onChangeCustom) {
          onChangeCustom(val);
        }
        onChange(val?.toString());
      }}
      defaultItems={options}
      labelPlacement="inside"
      // defaultInputValue={value?.toString() || ""}
      // defaultItems={options}
      // items={[]}
      aria-label="ht"
      isClearable={isClearable || false}
      label={
        <>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </>
      }
      size="lg"
      placeholder={placeholder}
      errorMessage={<div className="text-base">{error?.message}</div>}
      onKeyDown={(e: any) => e.continuePropagation()}
      classNames={{}}
      // allowsCustomValue={true}
    >
      {(item) => (
        <AutocompleteItem
          key={item?.value || ""}
          value={item?.value || ""}
          textValue={item?.label || ""}
        >
          {item.label}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
