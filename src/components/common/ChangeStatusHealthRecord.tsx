import { Radio } from "antd";
import { RadioChangeEvent } from "antd/lib";
import * as React from "react";

export interface IChangeStatusHealthRecordProps {
  value: string;
  onChange: (e: RadioChangeEvent) => void;
}

export default function ChangeStatusHealthRecord({
  onChange,
  value,
}: IChangeStatusHealthRecordProps) {
  return (
    <div>
      <>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={"S1"}>chờ thành toán</Radio>
          <Radio value={"S2"}>chờ khám bệnh</Radio>
          <Radio value={"S3"}>đã khám </Radio>
          <Radio value={"S4"}>hủy </Radio>
        </Radio.Group>
      </>
    </div>
  );
}
