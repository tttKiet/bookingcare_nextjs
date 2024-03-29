import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
import TextArea from "antd/es/input/TextArea";

export function InputTextareaField({
  name,
  label,
  control,
  placeholder,
  type = "text",
}: InputFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div
      className={`border rounded-lg border-while py-4 px-3 pt-9 relative ${
        error?.message && "border-red-400"
      }`}
    >
      <label
        className="absolute top-2 text-sm font-semibold flex items-center gap-2"
        htmlFor=""
      >
        {label}
      </label>
      <div className="flex items-center gap-1 relative pb-4">
        <TextArea
          placeholder={placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`}
          className="px  outline-none border-transparent text-base"
          showCount
          ref={ref}
          onBlur={onBlur}
          name={name}
          spellCheck={false}
          value={value}
          maxLength={1000}
          onChange={onChange}
          rows={2}
        />
      </div>
      {error?.message && (
        <span className="text-sm text-red-500 font-medium">
          {error?.message}
        </span>
      )}
    </div>
  );
}
