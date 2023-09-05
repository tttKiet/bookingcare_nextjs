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
  options: DefaultOptionType[] | undefined;
}

export function SelectField({
  name,
  label,
  control,
  className,
  options,
  icon,
  width,
}: SelectFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
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
          defaultValue={""}
          value={value}
          style={{ width: width || 160 }}
          onChange={onChange}
          options={options}
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
