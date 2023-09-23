"use client";

import { WorkingCurrentTag } from "@/components/common/working.current.tag";
import { Tabs, TabsProps } from "antd";

export default function WorkAdmin() {
  const items: TabsProps["items"] = [
    {
      key: "current",
      label: "Đang làm việc",
      children: <WorkingCurrentTag />,
    },
    {
      key: "history",
      label: "Lịch sử làm việc",
      children: <p>Lịch sử làm việc</p>,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="current" items={items} onChange={onChange} />
    </div>
  );
}
