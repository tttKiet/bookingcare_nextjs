"use client";

import { WorkingCurrentTag } from "@/components/common";
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
      label: "Lịch sử công tác",
      children: <p className="text-center p-6 text-blue-600">Updating...</p>,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="box-white">
      <Tabs defaultActiveKey="current" items={items} onChange={onChange} />
    </div>
  );
}
