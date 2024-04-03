"use client";

import { ColorBox } from "@/components/box";
import {
  AddPatientProfile,
  BreadcrumbApp,
  PartientProfile,
} from "@/components/common";
import {
  ContentTagPatientProfile,
  ItemContentPatientProfile,
} from "@/components/common/content.tag.user.patient-profile";
import { useAuth } from "@/hooks";
import { Breadcrumb, Menu, MenuProps, Tabs, TabsProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { BsCalendar2Plus } from "react-icons/bs";

const TagNames = {
  ONE: "patient-profile",
  TWO: "add-patient-profile",
};

export default function UserPage() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const router = useRouter();
  const tagName = searchParams.get("tag");

  const items: MenuProps["items"] = [
    {
      key: TagNames.ONE,
      label: <Link href={`/user?tag=${TagNames.ONE}`}>Hồ sơ bệnh nhân</Link>,
      icon: <AiOutlineProfile />,
    },
    {
      key: TagNames.TWO,
      label: <Link href={`/user?tag=${TagNames.TWO}`}>Thêm hồ sơ</Link>,
      icon: <BsCalendar2Plus />,
    },
  ];

  const itemContents: ItemContentPatientProfile[] = [
    {
      key: TagNames.ONE,
      component: <PartientProfile />,
    },
    {
      key: TagNames.TWO,
      component: <AddPatientProfile />,
    },
  ];

  useEffect(() => {
    if (!(tagName && Object.values(TagNames).includes(tagName))) {
      router.push(`/user?tag=${TagNames.ONE}`);
    }
  }, [tagName, router, TagNames]);

  return (
    <div className="py-8 min-h-screen ">
      <div className="container mx-auto">
        <BreadcrumbApp />
        {profile?.id ? (
          <div className="flex items-start">
            <div className="hidden md:block">
              <Menu
                className="pr-8"
                style={{ width: 286 }}
                defaultSelectedKeys={[
                  tagName && Object.values(TagNames).includes(tagName)
                    ? tagName
                    : TagNames.ONE,
                ]}
                defaultOpenKeys={[TagNames.ONE]}
                theme={"light"}
                items={items}
                mode="inline"
              />
            </div>

            <div className="md:ml-8 flex-1 mt-[4px]">
              <ContentTagPatientProfile
                items={itemContents}
                activeKey={
                  tagName && Object.values(TagNames).includes(tagName)
                    ? tagName
                    : TagNames.ONE
                }
              />
            </div>
          </div>
        ) : (
          <p className="text-base text-center rounded-lg shadow bg-red-400 text-white p-3 flex-1">
            Bạn chưa đăng nhập
          </p>
        )}
      </div>
    </div>
  );
}
