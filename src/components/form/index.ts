import { Control } from "react-hook-form";

export * from "./input-field";
export * from "./check-box-field";
export * from "./input-code-phone-field";
export * from "./radio-group-field";
export * from "./select-field";
export * from "./input-upload-field";
export * from "./input-field-textarea";
export * from "./select-field-search";
export * from "./select-field-add-option";

export interface InputFieldProps {
  name: string;
  label: string;
  control: Control<any>;
  type?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  min?: number;
  max?: number;
  width?: number | string;
}
