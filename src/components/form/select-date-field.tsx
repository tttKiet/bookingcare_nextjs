"use client";

import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import * as React from "react";
import { Control, useController } from "react-hook-form";

export interface SelectDateFieldProps {
  name: string;
  label: string | React.ReactNode;
  control: Control<any>;
  icon?: React.ReactNode;
  width?: number;
  placeholder?: string;
}

export function SelectDateCalendarField({
  name,
  label,
  control,
  icon,
  width,
  placeholder,
}: SelectDateFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const onChangeDate = (date: Dayjs | null) => {
    if (date) {
      onChange(date);
    } else {
      onChange(null);
    }
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
      <div className="flex items-center gap-1 ">
        {/* <DateCalendar date={value} handleSelect={onChange} /> */}
        <DatePicker bordered={true} value={value} onChange={onChangeDate} />
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
