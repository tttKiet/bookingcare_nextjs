import { RadioGroup, Radio, cn, RadioProps } from "@nextui-org/react";
import React from "react";

export default function RadioSearchEmailStar(props: RadioProps) {
  const { children, ...otherProps } = props;
  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "flex m-0 bg-content1 max-w-full hover:bg-content2 items-center justify-between",
          "flex-row-reverse cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
}
