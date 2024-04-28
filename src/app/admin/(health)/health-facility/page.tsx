"use client";

import { HealthFacilitiesBox } from "@/components/admin-box";
import { HealthFacilitiesPage } from "@/components/admin-box/HealthFacilitiesPage";
import { ManagerAdminHealthFacility } from "@/components/admin-box/ManagerAdminHealthFacility";
import { Tab, Tabs } from "@nextui-org/react";

export interface HealthFacilitiesAdminProps {}

export default function HealthFacilitiesAdmin(
  props: HealthFacilitiesAdminProps
) {
  // const items: TabsProps["items"] = [
  //   {
  //     key: "health",
  //     label: "Cơ sở y tế",
  //     children: <HealthFacilitiesBox />,
  //   },
  //   {
  //     key: "manager_admin",
  //     label: "Quản lý nhân viên",
  //     children: <ManagerAdminHealthFacility />,
  //   },
  // ];
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="box-white">
      {/* <HealthFacilitiesBox /> */}
      <Tabs color={"primary"} radius="sm" className="flex justify-start">
        <Tab
          key="health"
          title="Cơ sở y tế"
          children={<HealthFacilitiesBox />}
        />
        <Tab
          key="page"
          title="Chi tiết trang"
          children={<HealthFacilitiesPage />}
        />
      </Tabs>
    </div>
  );
}
