"use client";

import { ColorBox } from "@/components/box";
import {
  AddPatientProfile,
  BreadcrumbApp,
  PartientProfile,
} from "@/components/common";
import { HiPower } from "react-icons/hi2";
import {
  ContentTagPatientProfile,
  ItemContentPatientProfile,
} from "@/components/common/content.tag.user.patient-profile";
import TagUserBooking from "@/components/common/TagUserBooking";
import { AddNoteIcon } from "@/components/icons/AddNoteIcon";
import { useAuth } from "@/hooks";
import {
  Button,
  cn,
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@nextui-org/react";
import { Breadcrumb, Menu, MenuProps, Tabs, TabsProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { AiOutlineProfile } from "react-icons/ai";
import { BsCalendar2Plus } from "react-icons/bs";
import { GrSchedules } from "react-icons/gr";
import TagUserAccount from "@/components/common/TagUserAccount";
const TagNames = {
  ONE: "patient-profile",
  TWO: "add-patient-profile",
  FOUR: "booking",
  FIVE: "account",
};

interface ItemMenuUser {
  key: string;
  decs?: string;
  label: ReactNode;
  icon?: ReactNode;
}

interface ItemMenuActionUser {
  action: string;
  data: ItemMenuUser[];
}

export default function UserPage() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const router = useRouter();
  const tagName = searchParams.get("tag");
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  const iconClassesActive =
    "text-xl text-black pointer-events-none flex-shrink-0";
  const items: ItemMenuActionUser[] = [
    {
      action: "Tôi",
      data: [
        {
          key: TagNames.FIVE,
          label: (
            <Link href={`/user?tag=${TagNames.FIVE}`}>Tài khoản của bạn</Link>
          ),
          icon: <AiOutlineProfile />,
        },
      ],
    },
    {
      action: "Người khám",
      data: [
        {
          key: TagNames.ONE,
          label: (
            <Link href={`/user?tag=${TagNames.ONE}`}>Hồ sơ bệnh nhân</Link>
          ),
          icon: <AiOutlineProfile />,
        },
        {
          key: TagNames.TWO,
          label: <Link href={`/user?tag=${TagNames.TWO}`}>Thêm hồ sơ</Link>,
          icon: <AddNoteIcon />,
        },
      ],
    },
    {
      action: "Lịch hẹn",
      data: [
        {
          key: TagNames.FOUR,
          label: <Link href={`/user?tag=${TagNames.FOUR}`}>Lịch hẹn khám</Link>,
          icon: <GrSchedules size={18} />,
        },
      ],
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
    {
      key: TagNames.FOUR,
      component: <TagUserBooking />,
    },
    {
      key: TagNames.FIVE,
      component: <TagUserAccount />,
    },
  ];

  useEffect(() => {
    if (!(tagName && Object.values(TagNames).includes(tagName))) {
      router.push(`/user?tag=${TagNames.ONE}`);
    }
  }, [tagName, router, TagNames]);

  return (
    <div className="py-8 min-h-screen bg-[#F0F3F7]">
      <div className="container mx-auto">
        {/* <BreadcrumbApp /> */}
        {profile?.id ? (
          <div className="flex items-start">
            <div className="hidden md:block">
              <div
                className="max-w-[286px] w-[286px] border-small  py-2 rouded_main
              shadow-lg
              border-default-200 dark:border-default-100 relative bg-white overflow-hidden px-3"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rouded_main_t"></div>
                <Listbox
                  variant="flat"
                  aria-label="Listbox menu with sections "
                  className="pt-4 "
                >
                  {items.map((i, index) => (
                    <ListboxSection
                      key={i.action}
                      title={i.action}
                      showDivider={items.length - 1 !== index}
                    >
                      {i.data.map((listItem) => (
                        <ListboxItem
                          key={listItem.key}
                          description={listItem.decs}
                          className={
                            tagName == listItem.key
                              ? "bg-gray-300 text-black mt-2"
                              : " mt-2"
                          }
                          startContent={
                            <div
                              className={
                                tagName == listItem.key
                                  ? `${iconClassesActive} mr-2`
                                  : `${iconClasses} mr-2`
                              }
                            >
                              {listItem.icon}
                            </div>
                          }
                          textValue=""
                        >
                          {listItem.label}
                        </ListboxItem>
                      ))}
                    </ListboxSection>
                  ))}
                </Listbox>
              </div>
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
