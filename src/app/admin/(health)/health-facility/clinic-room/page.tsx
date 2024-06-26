"use client";

import { ManagerClinicWork, ManagerHealthRoom } from "@/components/admin-box";
import { ManagerClinicRoom } from "@/components/admin-box/manager.clinic-room";
import { Tabs, TabsProps } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface IRoomProps {}

export default function Room(props: IRoomProps) {
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag");
  const tags = useMemo(
    () => ["manager-clinic-rooms", "manager-work-clinic-room"],
    []
  );
  const items: TabsProps["items"] = [
    {
      key: "manager-clinic-rooms",
      label: (
        <Link href="/admin/health-facility/clinic-room?tag=manager-clinic-rooms">
          Quản lý phòng khám
        </Link>
      ),
      children: <ManagerHealthRoom />,
    },
    {
      key: "manager-work-clinic-room",
      label: (
        <Link href="/admin/health-facility/clinic-room?tag=manager-work-clinic-room">
          Phân công phòng khám bệnh
        </Link>
      ),
      children: <ManagerClinicWork />,
    },
  ];
  const onChange = (key: string) => {};
  return (
    <div className="box-white">
      <Tabs
        defaultActiveKey="manager-clinic-rooms"
        activeKey={tag && tags.includes(tag) ? tag : "manager-clinic-rooms"}
        items={items}
        onChange={onChange}
      />
    </div>
  );
}
