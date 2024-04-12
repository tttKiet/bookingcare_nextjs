import { useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
import { InputNumber } from "antd";
import { Input } from "@nextui-org/react";

export function InputField({
  name,
  label,
  control,
  placeholder,
  type = "text",
  icon,
  min,
  max,
  width,
  isRequired,
}: InputFieldProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  function toggleShowPass(): void {
    setShowPass((s) => !s);
  }

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
      {type === "number" ? (
        <>
          <InputNumber
            placeholder={
              placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
            }
            className="outline-none border-transparent text-base"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
            spellCheck={false}
            name={name}
            value={value}
            min={min}
            max={max}
            width={width || "auto"}
          />
        </>
      ) : (
        <>
          {type == "date" ? (
            <Input
              color={
                error?.message ? "danger" : isSubmitted ? "primary" : "default"
              }
              size="lg"
              type="date"
              placeholder={
                placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
              }
              classNames={{
                errorMessage: "text-base",
              }}
              label={
                <>
                  {label}{" "}
                  {isRequired && <span className="text-red-400">*</span>}
                </>
              }
              ref={ref}
              spellCheck={false}
              name={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              errorMessage={error?.message}
            />
          ) : (
            <Input
              color={
                error?.message ? "danger" : isSubmitted ? "primary" : "default"
              }
              size="lg"
              type={type == "password" && !showPass ? "password" : "text"}
              placeholder={
                placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
              }
              // className="px outline-none border-transparent text-base"
              onChange={onChange}
              label={
                <>
                  {label}{" "}
                  {isRequired && <span className="text-red-400">*</span>}
                </>
              }
              onBlur={onBlur}
              classNames={{
                errorMessage: "text-base",
              }}
              endContent={
                <>
                  {type == "password" ? (
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleShowPass}
                    >
                      {showPass ? (
                        <AiOutlineEyeInvisible className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <AiOutlineEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </>
              }
              ref={ref}
              spellCheck={false}
              name={name}
              value={value}
              errorMessage={error?.message}
            />
          )}
        </>
      )}
    </div>
  );
}
