"use client";

import { Modal } from "antd";

import { User } from "@/models";
import { ManagerAccountUser } from "../admin/ManagerAccountUser";
import { ManagerAccountStaff } from "../admin/ManagerAccountStaff";
import { ManagerAccountManager } from "../admin/ManagerAccountManager";
const { confirm } = Modal;

import { Tabs, Tab } from "@nextui-org/react";
import { FormEvent, FormEventHandler, Key, useState } from "react";
type DataIndex = keyof User;

export function ManagerAccount() {
  const [selected, setSelected] = useState<Key>("user");
  const items = [
    {
      key: "user",
      label: "Người dùng",
      children: <ManagerAccountUser />,
    },
    {
      key: "doctor",
      label: "Bác sĩ",
      children: <ManagerAccountStaff />,
    },
    {
      key: "hospital_manager",
      label: "Nhân viên",
      children: <ManagerAccountManager />,
    },
  ];
  return (
    <div className="box-white text-left">
      <Tabs
        selectedKey={selected}
        color="primary"
        onSelectionChange={setSelected}
      >
        {items.map((i) => {
          return <Tab key={i.key} title={i.label} children={i.children} />;
        })}
      </Tabs>
    </div>
  );
}
