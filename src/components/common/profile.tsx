"use client";

import { Space } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar-logout";
import { useAuth } from "@/hooks";
import { useSelector } from "react-redux";
import { getMode } from "@/redux/selector";
import { useMemo } from "react";
import { Avatar } from "@nextui-org/react";
import { CiUser } from "react-icons/ci";

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const { profile, logout } = useAuth({ revalidateOnMount: true });
  const isUser = useMemo(() => profile && !profile.Role, [profile]);
  return (
    <div>
      {profile?.email && (
        <div className="flex items-center py-1 px-2 gap-3">
          <div className="flex flex-col justify-center items-end ">
            <div className="color-primary text-base font-medium">
              {profile?.fullName?.trim()?.toLocaleUpperCase()}
            </div>
            <div className="text-xs color-second">{profile.email}</div>
          </div>
          <div className="cursor-pointer">
            <MenuNavbarLogout />
          </div>
        </div>
      )}
    </div>
  );
}
