import { Checkbox, Select } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { DefaultOptionType } from "antd/es/select";
import * as React from "react";
import { Control, useController } from "react-hook-form";

export interface SelectFieldProps {
  className?: string;
  name: string;
  label: string | React.ReactNode;
  control: Control<any>;
  icon?: React.ReactNode;
  width?: number;
  placeholder?: string;
  options: DefaultOptionType[] | undefined;
  onChangeParent?: (e: Event) => void;
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
}: SelectFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  const filterOption: any = (
    input: string,
    option: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const refSelect = React.useRef();
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
          value={value}
          style={{ width: width || 160 }}
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
          // listHeight={260}
          // tokenSeparators={[","]}
          // dropdownStyle={{ position: "fixed" }}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          // ref={refSelect.current}
          // getPopupContainer={() => refSelect.current || document.body}
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
