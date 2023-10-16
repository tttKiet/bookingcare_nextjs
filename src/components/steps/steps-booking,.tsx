import { StepProps, Steps } from "antd";
import * as React from "react";

export interface IStepBookingsProps {
  current?: number;
  onChange?: (current: number) => void;
  items: StepProps[];
}

export default function StepBookings({
  current,
  onChange,
  items,
}: IStepBookingsProps) {
  return (
    <Steps
      progressDot
      onChange={onChange}
      current={current}
      direction="vertical"
      items={items}
    />
  );
}
