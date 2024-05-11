"use client";

import { useAuth } from "@/hooks";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
import { useMemo } from "react";
import UserAvatar from "../../assets/images/user/user-avatar.jpg";
import StaffAvatar from "../../assets/images/staff/staff.jpg";
import DoctorAvatar from "../../assets/images/doctor/doctor_avatar.jpg";
export interface MenuDropdownProps {
  title: string;
  icon?: React.ReactNode;
  titleType?: string;
  items: any;
  placement?: string;
}

export default function MenuDropdown({ title, items }: MenuDropdownProps) {
  const { profile, logout } = useAuth();
  const ImageProfile = useMemo(() => {
    switch (profile?.Role?.keyType) {
      case "doctor": {
        return (
          <Avatar isBordered size="md" color="primary" src={DoctorAvatar.src} />
        );
      }
      case "hospital_manager": {
        return (
          <Avatar isBordered size="md" color="primary" src={StaffAvatar.src} />
        );
      }
      case "admin": {
        return (
          <Avatar isBordered size="md" color="primary" src={StaffAvatar.src} />
        );
      }

      default: {
        return (
          <Avatar isBordered size="md" color="primary" src={UserAvatar.src} />
        );
      }
    }
  }, [profile, profile?.Role?.keyType]);

  return (
    <Dropdown size="lg" className="w-[260px] px-4" placement={"bottom-end"}>
      <DropdownTrigger>{ImageProfile}</DropdownTrigger>
      <DropdownMenu variant="flat" className="">
        {items
          .filter(
            (g: any) => g.data.filter((q: any) => q?.show !== false).length > 0
          )
          .map((gr: any) => (
            <DropdownSection
              title={gr.gr}
              key={gr.gr}
              showDivider={gr.gr !== "Hành động"}
            >
              {gr.data
                .filter((d: any) => d?.show !== false)
                .map((d: any) => (
                  <DropdownItem
                    onPress={d?.onClick}
                    className={
                      d.key === "logout" ? "text-danger" : "text-[#000]"
                    }
                    key={d.key}
                    startContent={d?.icon}
                    color={d.key === "logout" ? "danger" : "default"}
                  >
                    {d.label}
                  </DropdownItem>
                ))}
            </DropdownSection>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
