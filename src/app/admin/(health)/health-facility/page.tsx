"use client";

import { HealthFacilitiesBox } from "@/components/admin-box";
import { HealthFacilitiesPage } from "@/components/admin-box/HealthFacilitiesPage";
import { ManagerAdminHealthFacility } from "@/components/admin-box/ManagerAdminHealthFacility";
import { Tab, Tabs } from "@nextui-org/react";

export interface HealthFacilitiesAdminProps {}

export default function HealthFacilitiesAdmin(
  props: HealthFacilitiesAdminProps
) {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <div className="box-white">
      {/* <HealthFacilitiesBox /> */}
      <Tabs
        color={"primary"}
        radius="sm"
        defaultSelectedKey={"manager-clinic-rooms"}
        className="flex justify-start"
      >
        <Tab
          key="health"
          title="Cơ sở y tế"
          children={<HealthFacilitiesBox />}
        />
        <Tab
          key="page"
          title="Chi tiết lời giới thiệu"
          children={<HealthFacilitiesPage />}
        />
      </Tabs>
    </div>
  );
}
