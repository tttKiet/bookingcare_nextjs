import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
import { Textarea } from "@nextui-org/react";

export function InputTextareaField({
  name,
  label,
  control,
  isRequired = true,
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
        classNames={{
          errorMessage: "text-base",
        }}
        label={
          label && (
            <>
              {label} {isRequired && <span className="text-red-400">*</span>}
            </>
          )
        }
        placeholder={placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`}
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
