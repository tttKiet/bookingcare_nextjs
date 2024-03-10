"use client";

import { HealthFacilitiesBox } from "@/components/admin-box";
import { ManagerAdminHealthFacility } from "@/components/admin-box/ManagerAdminHealthFacility";
import { Tabs, TabsProps } from "antd";

export interface HealthFacilitiesAdminProps {}

export default function HealthFacilitiesAdmin(
  props: HealthFacilitiesAdminProps
) {
  const items: TabsProps["items"] = [
    {
      key: "health",
      label: "Cơ sở y tế",
      children: <HealthFacilitiesBox />,
    },
    {
      key: "manager_admin",
      label: "Quản lý nhân viên",
      children: <ManagerAdminHealthFacility />,
    },
  ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="box-white">
      <Tabs
        defaultActiveKey="health"
        className="px-0"
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
