"use client";

import { Modal, Tabs, TabsProps } from "antd";

import { User } from "@/models";
import { ManagerAccountUser } from "../admin/ManagerAccountUser";
import { ManagerAccountStaff } from "../admin/ManagerAccountStaff";
import { ManagerAccountManager } from "../admin/ManagerAccountManager";
const { confirm } = Modal;

type DataIndex = keyof User;

export function ManagerAccount() {
  const items: TabsProps["items"] = [
    {
      key: "user",
      label: "Người dùng",
      children: <ManagerAccountUser />,
    },
    {
      key: "doctor",
      label: "Bác sỉ",
      children: <ManagerAccountStaff />,
    },
    {
      key: "hospital_manager",
      label: "Quản lý bệnh viện",
      children: <ManagerAccountManager />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="p-4">
      <Tabs defaultActiveKey="user" items={items} onChange={onChange} />
    </div>
  );
}
