"use client";

import { API_CODE } from "@/api-services/constant-api";
import { Code } from "@/models";
import { ResDataPaginations } from "@/types";
import { Tab, Tabs } from "@nextui-org/react";
import { Key, useState } from "react";
import useSWR from "swr";
import { TagBookingUser } from "./TagBookingUser";
import { getColorChipCheckUp } from "@/untils/common";

export interface ITagUserBookingProps {}

export default function TagUserBooking(props: ITagUserBookingProps) {
  const [selected, setSelected] = useState("CU1");
  const [colorSelected, setColorSelected] = useState<
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined
  >("default");
  function onSelectionChange(key: Key) {
    setSelected(key.toString());
    const color = getColorChipCheckUp(key.toString());
    setColorSelected(color);
  }
  const { data: codeRes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}?name=CheckUp`
  );

  return (
    <div>
      <div className="box-white rouded_main inline-block mt-[-4px] ml-2">
        <Tabs
          selectedKey={selected}
          onSelectionChange={onSelectionChange}
          color={colorSelected}
          className="pt-0 mt-0"
          variant="underlined"
        >
          {codeRes?.rows.map((c: Code) => (
            <Tab key={c.key} title={c.value} />
          ))}
        </Tabs>
      </div>

      <div className="mt-4">
        <TagBookingUser selectedKey={selected} />
      </div>
    </div>
  );
}
