"use client";

import { Modal, Tabs, TabsProps } from "antd";

import { User } from "@/models";
import { ManagerAccountUser } from "../admin/ManagerAccountUser";
import { ManagerAccountStaff } from "../admin/ManagerAccountStaff";
import ChartRecord from "./manager.chart.record";
import ChartAccount from "./manager.chart.account";
const { confirm } = Modal;

type DataIndex = keyof User;

export function ManagerChart() {
  const items: TabsProps["items"] = [
    {
      key: "record",
      label: "Người dùng đặt lịch",
      children: <ChartRecord />,
    },
    {
      key: "account",
      label: "Tài khoản",
      children: <ChartAccount />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="record" items={items} onChange={onChange} />
    </div>
  );
}
