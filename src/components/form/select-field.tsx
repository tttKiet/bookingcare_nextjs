"use client";

import { Checkbox, Select } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DefaultOptionType } from "antd/es/select";
import { Control, useController } from "react-hook-form";
import debounce from "lodash.debounce";

export interface SelectFieldProps {
  className?: string;
  name: string;
  label: string | React.ReactNode;
  control: Control<any>;
  icon?: React.ReactNode;
  width?: number | string;
  placeholder?: string;
  options: DefaultOptionType[] | undefined;
  onChangeParent?: (e: Event) => void;
  debounceSeconds?: number;
  onSearchSelect?: (value: string) => void;
  disabled?: boolean;
}

export function SelectField({
  name,
  label,
  control,
  className,
  options,
  icon,
  width,
  placeholder,
  onChangeParent,
  debounceSeconds,
  onSearchSelect,
  disabled = false,
}: SelectFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const onSearch = (value: string) => {
    onSearchSelect && onSearchSelect(value);
  };

  const filterOption: any = (
    input: string,
    option: { label: string; value: string }
  ) => {
    return !!onSearchSelect
      ? true
      : (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };

  return (
    <div
      className={`border rounded-lg border-while py-2 px-3 pt-8 relative col-span-1 ${
        error?.message && "border-red-400"
      }`}
    >
      <label
        className="absolute top-1 text-sm font-medium flex items-center gap-2"
        htmlFor=""
      >
        {label}
      </label>
      <div className="flex items-center gap-1 relative">
        <Select
          // defaultValue={""}
          disabled={disabled}
          onSearch={debounce(onSearch, debounceSeconds || 0)}
          value={value || placeholder}
          placement="bottomLeft"
          style={{ width: width || 160 }}
          size="large"
          onChange={(e) => {
            onChange(e);
            onChangeParent && onChangeParent(e);
          }}
          placeholder={
            placeholder ||
            `Chọn ${
              typeof label === "string" ? label?.toLocaleLowerCase() : label
            } ...`
          }
          virtual={false}
          showSearch
          optionFilterProp="children"
          notFoundContent={<div>Khônng tìm thây...</div>}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          options={options}
          filterOption={filterOption}
        />
        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error && (
        <p className="text-red-500 font-medium text-xs pt-1">
          {error?.message}
        </p>
      )}
    </div>
  );
}
