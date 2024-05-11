"use client";

import { ColorBox } from "@/components/box";
import {
  AddPatientProfile,
  BreadcrumbApp,
  PartientProfile,
} from "@/components/common";
import { HiChatBubbleBottomCenterText, HiPower } from "react-icons/hi2";
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
import { CiUser } from "react-icons/ci";
import { RiFolderUserLine } from "react-icons/ri";
import { PiFolderSimpleUserBold } from "react-icons/pi";
import { HiOutlineCalendar, HiOutlineNewspaper } from "react-icons/hi";
import { FaRegCircleUser } from "react-icons/fa6";
import { LiaBookMedicalSolid } from "react-icons/lia";
import TagUserMedicalRecord from "@/components/common/TagUserMedicalRecord";
import TagUserResult from "@/components/common/TagUserResult";
import { AnimatePresence, motion } from "framer-motion";
import TagUserChat from "@/components/common/TagUserChat";

const TagNames = {
  ONE: "patient-profile",
  TWO: "add-patient-profile",
  FOUR: "booking",
  FIVE: "account",
  SIX: "medical-record",
  SERVEN: "result",
  EIGHT: "chat",
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
  const tagName = searchParams.get("tag");
  const url = usePathname();
  const fullUrl = url + `?tag=${tagName}`;
  const router = useRouter();
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0 ml-3";
  const iconClassesActive =
    "text-xl bg-[#e6f4ff] pointer-events-none flex-shrink-0 ml-3";
  const items: ItemMenuActionUser[] = [
    {
      action: "Tôi",
      data: [
        {
          key: `/user?tag=${TagNames.FIVE}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.FIVE}`}>
              Tài khoản của bạn
            </Link>
          ),
          icon: <FaRegCircleUser size={18} />,
        },
      ],
    },
    {
      action: "Hổ trợ",
      data: [
        {
          key: `/user?tag=${TagNames.EIGHT}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.EIGHT}`}>
              Chat với bác sĩ
            </Link>
          ),
          icon: <HiChatBubbleBottomCenterText size={18} />,
        },
      ],
    },
    {
      action: "Người khám",
      data: [
        {
          key: `/user?tag=${TagNames.ONE}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.ONE}`}>
              Hồ sơ bệnh nhân
            </Link>
          ),
          icon: <RiFolderUserLine size={18} />,
        },
        {
          key: `/user?tag=${TagNames.TWO}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.TWO}`}>
              Thêm hồ sơ
            </Link>
          ),
          icon: <PiFolderSimpleUserBold size={18} />,
        },
      ],
    },
    {
      action: "Lịch hẹn",
      data: [
        {
          key: `/user?tag=${TagNames.FOUR}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.FOUR}`}>
              Lịch hẹn khám
            </Link>
          ),
          icon: <HiOutlineCalendar size={18} />,
        },
        {
          key: `/user?tag=${TagNames.SERVEN}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.SERVEN}`}>
              Kết quả khám bệnh
            </Link>
          ),
          icon: <HiOutlineNewspaper size={18} />,
        },
      ],
    },
    {
      action: "Bệnh án",
      data: [
        {
          key: `/user?tag=${TagNames.SIX}`,
          label: (
            <Link className="font-medium" href={`/user?tag=${TagNames.SIX}`}>
              Hồ sơ bệnh án
            </Link>
          ),
          icon: <LiaBookMedicalSolid size={18} />,
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
    {
      key: TagNames.SIX,
      component: <TagUserMedicalRecord />,
    },
    {
      key: TagNames.SERVEN,
      component: <TagUserResult />,
    },
    {
      key: TagNames.EIGHT,
      component: <TagUserChat />,
    },
  ];

  useEffect(() => {
    if (!(tagName && Object.values(TagNames).includes(tagName))) {
      router.push(`/user?tag=${TagNames.ONE}`);
    }
  }, [tagName, router, TagNames]);

  return (
    <>
      {" "}
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
                    className="pt-4 font-medium"
                  >
                    {items.map((i, index) => (
                      <ListboxSection
                        key={i.action}
                        title={i.action}
                        showDivider={items.length - 1 !== index}
                      >
                        {i.data.map((listItem) => {
                          return (
                            <ListboxItem
                              key={listItem.key}
                              description={listItem.decs}
                              onClick={() => router.push(listItem.key)}
                              className={
                                fullUrl == listItem.key
                                  ? "bg-[#e6f4ff] text-[#2884FF] mt-2"
                                  : " mt-2"
                              }
                              startContent={
                                <div
                                  className={
                                    fullUrl == listItem.key
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
                          );
                        })}
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
    </>
  );
}
