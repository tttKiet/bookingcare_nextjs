import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { ReactNode } from "react";
import { Control, useController } from "react-hook-form";
import { ClassificationTypeNames } from "typescript";

export interface CheckBoxFieldProps {
  className?: string;
  name: string;
  label: string | ReactNode;
  control: Control<any>;
}

export function CheckBoxField({
  name,
  label,
  control,
  className,
}: CheckBoxFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div>
      <Checkbox checked={value} className={className} onChange={onChange}>
        {label}
      </Checkbox>
      {error && (
        <p className="text-red-500 font-medium text-xs pt-1">
          {error?.message}
        </p>
      )}
    </div>
  );
}
