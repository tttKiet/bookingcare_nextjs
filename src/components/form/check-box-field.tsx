import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import * as React from "react";
import { ClassificationTypeNames } from "typescript";

export interface CheckBoxFieldProps {
  title: string;
  checked?: boolean;
  className?: string;
  onChange: (value: CheckboxChangeEvent) => void;
}

export function CheckBoxField({
  title,
  onChange,
  checked = true,
  className,
}: CheckBoxFieldProps) {
  return (
    <Checkbox checked={checked} className={className} onChange={onChange}>
      {title}
    </Checkbox>
  );
}
