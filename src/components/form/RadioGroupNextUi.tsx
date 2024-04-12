import { Radio, RadioGroup } from "@nextui-org/react";
import { Control, useController } from "react-hook-form";

export interface RadioGroupNextUiProps {
  options: { label: string; value: string; disabled?: boolean }[];
  name: string;
  label?: string;
  control: Control<any>;
  icon?: React.ReactNode;
  isRequired?: boolean;
}

export function RadioGroupNextUi({
  options,
  control,
  name,
  label,
  icon,
  isRequired,
}: RadioGroupNextUiProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({
    name,
    control,
  });
  return (
    <div className="flex items-center gap-1 relative">
      <RadioGroup
        color={error?.message ? "danger" : isSubmitted ? "primary" : "default"}
        ref={ref}
        onChange={onChange}
        size="md"
        label={
          <>
            {label} {isRequired && <span className="text-red-400">*</span>}
          </>
        }
        value={value}
        name="gender"
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
    </div>
  );
}
