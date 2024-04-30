import { ChangeEvent, useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Input } from "@nextui-org/react";
import { InputFieldProps } from ".";
import { DatePicker } from "@nextui-org/date-picker";

export interface InputNextDateFieldProps extends InputFieldProps {}

export function InputNextDateField({
  name,
  label,
  control,
  placeholder,
  type = "text",
  icon,
  min,
  max,
  width,
  color,
  isRequired = true,
  unit,
  variant,
  labelPlacement,
}: InputNextDateFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });

  return (
    <div className="text-base ">
      <DatePicker
        color={error?.message ? "danger" : isSubmitted ? "primary" : "default"}
        label={
          label && (
            <div className="text-base">
              {label} {isRequired && <span className="text-red-400">*</span>}
            </div>
          )
        }
        classNames={{
          label: "text-base",
          errorMessage: "text-sm",
        }}
        labelPlacement={labelPlacement}
        variant={variant}
        ref={ref}
        name={name}
        spellCheck={false}
        value={value}
        errorMessage={<p className="text-sm">{error?.message}</p>}
        onChange={onChange}
        placeholder={
          placeholder ||
          `chọn ${
            typeof label !== "string" ? label : label?.toLocaleLowerCase()
          } ...`
        }
        size="lg"
      />
    </div>
  );
}
