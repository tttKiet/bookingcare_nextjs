"use client";

import { API_CODE } from "@/api-services/constant-api";
import { Code } from "@/models";
import { ResDataPaginations } from "@/types";
import { Tab, Tabs } from "@nextui-org/react";
import { Key, useState } from "react";
import useSWR from "swr";
import { TagBookingUser } from "./TagBookingUser";

export interface ITagUserBookingProps {}

export default function TagUserBooking(props: ITagUserBookingProps) {
  const [selected, setSelected] = useState("CU1");
  const [colorSelected, setColorSelected] = useState<
    "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  >("default");
  function onSelectionChange(key: Key) {
    setSelected(key.toString());
    if (key == "CU2") {
      setColorSelected("primary");
    } else if (key == "CU3") {
      setColorSelected("success");
    } else if (key == "CU4") {
      setColorSelected("danger");
    } else {
      setColorSelected("default");
    }
  }
  const { data: codeRes } = useSWR<ResDataPaginations<Code>>(
    `${API_CODE}?name=CheckUp`
  );

  return (
    <div>
      <div className="bg-white rouded_main inline-block mt-[-4px] ml-2">
        <Tabs
          selectedKey={selected}
          onSelectionChange={onSelectionChange}
          color={colorSelected}
          className="pt-0 mt-0"
          variant="bordered"
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
