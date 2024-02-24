import { Radio, RadioChangeEvent } from "antd";
import { Control, useController } from "react-hook-form";

export interface RadioGroupFieldProps {
  options: { label: string; value: string; disabled?: boolean }[];
  name: string;
  label?: string;
  control: Control<any>;
  icon: React.ReactNode;
}

export function RadioGroupField({
  options,
  control,
  name,
  label,
  icon,
}: RadioGroupFieldProps) {
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
      </label>

      <div className="flex items-center gap-1 relative">
        <Radio.Group
          ref={ref}
          options={options}
          onChange={onChange}
          size="small"
          value={value}
          optionType="button"
          buttonStyle="solid"
        />
        <span className="flex items-center absolute right-1 text-xl">
          {icon}
        </span>
      </div>
      {error?.message && (
        <p className="text-xs text-red-500 font-medium mt-1">
          {error?.message}
        </p>
      )}
    </div>
  );
}
