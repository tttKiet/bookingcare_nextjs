import { Button, ButtonProps } from "antd";
import * as React from "react";

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
