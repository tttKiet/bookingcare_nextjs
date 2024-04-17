import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
import { Textarea } from "@nextui-org/react";

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
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });

  return (
    <div>
      <Textarea
        color={error?.message ? "danger" : isSubmitted ? "primary" : "default"}
        size="lg"
        label={label}
        classNames={{
          errorMessage: "text-base",
        }}
        placeholder={placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`}
        // className="outline-none border-transparent text-base"
        ref={ref}
        name={name}
        spellCheck={false}
        value={value}
        errorMessage={error?.message}
        onChange={onChange}
      />
    </div>
  );
}
