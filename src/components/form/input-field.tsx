import { ChangeEvent, useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { InputFieldProps } from ".";
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
  color,
  isRequired = true,
  unit,
}: InputFieldProps) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const formatCurrency = (value: string) => {
    let result = "";
    if (value.length > 0) {
      const reverseValue = value.split("").reverse().join("");
      const currencyArray = reverseValue.match(/.{1,3}/g);
      result = currencyArray?.join(".").split("").reverse().join("") || "";
    }
    return result;
  };

  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });

  const [key, setKey] = useState<string>(() => {
    if (!value) return "";
    const rawValueString = value.toString();
    let rawValueNumber = rawValueString.replace(/[^0-9]/g, "");
    return formatCurrency(rawValueNumber);
  });
  function toggleShowPass(): void {
    setShowPass((s) => !s);
  }

  useEffect(() => {
    if (type == "number" && value) {
      const rawValueString = value?.toString() || "";
      let cur = formatCurrency(rawValueString);
      setKey(cur || "");
    } else {
      setKey("");
    }
  }, [value, type]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\./g, "");
    let rawValueNumber = rawValue.replace(/[^0-9]/g, "");
    const rawValueString = parseInt(rawValueNumber).toString();
    let value = formatCurrency(rawValueString);
    setKey(value);
    onChange(rawValueNumber);
  };

  return (
    <div className="text-base ">
      {type === "number" ? (
        <>
          <Input
            size="lg"
            placeholder={
              placeholder || `Nhập ${label?.toLocaleLowerCase()} ...`
            }
            endContent={unit && "vnđ"}
            onChange={handleChange}
            ref={ref}
            spellCheck={false}
            name={name}
            value={key}
            errorMessage={error?.message}
            min={min || 0}
            max={max}
            width={width || "auto"}
            color={
              color || error?.message
                ? "danger"
                : isSubmitted
                ? "primary"
                : "default"
            }
            label={
              <>
                {label} {isRequired && <span className="text-red-400">*</span>}
              </>
            }
            classNames={{
              errorMessage: "text-base",
            }}
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
