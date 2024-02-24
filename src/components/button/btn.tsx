import { Button, ButtonProps } from "antd";

export interface BtnProps {
  title: string;
  options?: ButtonProps;
}

export function Btn({ title, options, ...props }: BtnProps) {
  return (
    // className="px-3 py-1 border rounded-lg text-black"
    <Button {...options}>{title}</Button>
  );
}
