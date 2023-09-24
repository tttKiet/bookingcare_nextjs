import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
import { InputNumber } from "antd";

export function InputField({
  name,
  label,
  control,
  placeholder,
  type = "text",
  icon,
}: InputFieldProps) {
  const [showPass, setShowPass] = useState<boolean>(false);

  function toggleShowPass(): void {
    setShowPass((s) => !s);
  }

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <div
      className={`border rounded-lg border-while py-2 px-3 pt-8 relative ${
        error?.message && "border-red-400"
      }`}
    >
      <label
        className="absolute top-1 text-sm font-medium flex items-center gap-2"
        htmlFor=""
      >
        {label}

        {type === "password" && (
          <span
            className="text-base cursor-pointer hover:opacity-75 transition-opacity"
            onClick={toggleShowPass}
          >
            {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </span>
        )}
      </label>
      <div className="flex items-center gap-1 relative">
        {type === "number" ? (
          <InputNumber
            placeholder={
              placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
            }
            className="px w-[86%] outline-none border-transparent text-base"
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            spellCheck={false}
            name={name}
            value={value}
          />
        ) : (
          <input
            type={type == "password" && !showPass ? "password" : "text"}
            placeholder={
              placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
            }
            className="px  w-[86%]  outline-none border-transparent text-base"
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            spellCheck={false}
            name={name}
            value={value}
          />
        )}

        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error?.message && (
        <span className="text-xs text-red-500 font-medium">
          {error?.message}
        </span>
      )}
    </div>
  );
}
