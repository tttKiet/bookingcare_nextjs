"use client";

import { WorkingCurrentTag } from "@/components/common";
import { WorkingNoTag } from "@/components/common/WorkingNoTag";
import { Tab, Tabs } from "@nextui-org/react";
import { Key, useState } from "react";

export default function WorkAdmin() {
  const [selected, setSelected] = useState<string>("1");
  function onSelectionChange(v: Key) {
    setSelected(v.toString());
  }
  return (
    <div className="box-white text-left">
      <Tabs
        selectedKey={selected}
        onSelectionChange={onSelectionChange}
        color="primary"
        className={"text-left"}
        size="md"
        variant="solid"
      >
        <Tab key={"1"} title="Danh sách công tác">
          <WorkingCurrentTag />
        </Tab>
        <Tab key={"2"} title="Nhân viên chưa thêm">
          <WorkingNoTag onSelectionChange={onSelectionChange} />
        </Tab>
      </Tabs>
    </div>
  );
}
