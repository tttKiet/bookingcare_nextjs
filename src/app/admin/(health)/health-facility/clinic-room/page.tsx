"use client";

import { ManagerHealthRoom } from "@/components/admin-box";
import { ManagerClinicRoom } from "@/components/admin-box/manager.clinic-room";
import { Tabs, TabsProps } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import * as React from "react";

export interface IRoomProps {}

export default function Room(props: IRoomProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const items: TabsProps["items"] = [
    {
      key: "clinic-rooms",
      label: <Link href="/admin/health-facility/clinic-room"> Phòng khám</Link>,
      children: <ManagerClinicRoom />,
    },
    {
      key: "manager-clinic-rooms",
      label: (
        <Link href="/admin/health-facility/clinic-room?tag=manager-clinic-rooms">
          Quản lý phòng khám
        </Link>
      ),
      children: <ManagerHealthRoom />,
    },
  ];
  const onChange = (key: string) => {};
  return (
    <div className="p-4">
      <Tabs
        defaultActiveKey="clinic-rooms"
        activeKey={tag === "manager-clinic-rooms" ? tag : "clinic-rooms"}
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
