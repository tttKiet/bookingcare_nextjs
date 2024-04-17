import { Radio, RadioGroup } from "@nextui-org/react";
import { Control, useController } from "react-hook-form";

export interface RadioGroupFieldProps {
  options: { label: string; value: string; disabled?: boolean }[];
  name: string;
  label?: string;
  control: Control<any>;
  icon: React.ReactNode;
  isRequired?: boolean;
}

export function RadioGroupField({
  options,
  control,
  name,
  label,
  icon,
  isRequired = true,
}: RadioGroupFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });
  return (
    <RadioGroup
      color={error?.message ? "danger" : isSubmitted ? "primary" : "default"}
      ref={ref}
      onChange={onChange}
      size="sm"
      label={
        <>
          {label} {isRequired && <span className="text-red-400">*</span>}
        </>
      }
      value={value}
      name={name}
      errorMessage={error?.message}
      orientation="horizontal"
      classNames={{ errorMessage: "text-base" }}
    >
      {options.map((o) => (
        <Radio value={o.value} key={o.value}>
          {o.label}
        </Radio>
      ))}
    </RadioGroup>
  );
}
