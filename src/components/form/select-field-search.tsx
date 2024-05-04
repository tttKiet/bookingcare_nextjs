"use client";

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import type { SelectProps } from "antd";
import debounce from "lodash.debounce";
import { ReactNode } from "react";

export interface SelecSearchOptionProps {
  label: string;
  value: string;
  description?: ReactNode;
  startContent?: ReactNode;
}
export interface SelectSearchFieldProps {
  title?: string;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  value: string | null | undefined;
  data: SelecSearchOptionProps[];
  handleSearchSelect: (value: string) => void;
  handleChangeSelect: (value: string) => void;
  allowClear?: boolean;
  isRequired?: boolean;
  classLabel?: string;
  setting?: AutocompleteProps;
  allowsEmptyCollection?: boolean;
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
  setting,
  allowsEmptyCollection = true,
  classLabel,
}: SelectSearchFieldProps) {
  const handleSearch = (newValue: string) => {
    if (typeof newValue == "string") handleSearchSelect(newValue);
  };

  const handleChange = (e: string) => {
    handleChangeSelect(e);
  };

  const dataResult =
    data?.map((d) => ({
      value: d.value?.toString() || "",
      label: d.label,
      description: d?.description,
      startContent: d?.startContent,
    })) || [];

  const myFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) {
      return true;
    }

    if (typeof textValue == "string") {
      textValue = textValue
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.replace(/đ/g, "d")
        ?.toLocaleLowerCase();

      const wordsToSearch = inputValue
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.replace(/đ/g, "d")
        ?.toLowerCase()
        ?.split(/\s+/)
        ?.filter(Boolean);

      const wordConditions = wordsToSearch?.every((word) =>
        textValue?.includes(word)
      );

      return wordConditions;
    }
    return true;
  };

  return (
    <Autocomplete
      allowsEmptyCollection={allowsEmptyCollection}
      defaultFilter={myFilter}
      onInputChange={debounce(handleSearch, debounceSeconds || 300)}
      onSelectionChange={(e) => {
        handleChange(e?.toString() || "");
      }}
      label={
        <>
          {title} {isRequired && <span className="text-red-400">*</span>}
        </>
      }
      selectedKey={value}
      labelPlacement="inside"
      // defaultInputValue={value || ""}
      isClearable={allowClear}
      allowsCustomValue
      placeholder={placeholder}
      onKeyDown={(e: any) => e?.continuePropagation()}
      className="max-w-2xl w-full"
      {...setting}
    >
      {data?.map(
        (item) =>
          (
            <AutocompleteItem
              key={item.value || ""}
              value={item?.value || ""}
              textValue={item?.label || ""}
              startContent={item?.startContent}
            >
              <div className={classLabel}>{item.label}</div>
              {item.description}
            </AutocompleteItem>
          ) || []
      )}
    </Autocomplete>
  );
}
