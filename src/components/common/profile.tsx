"use client";

import { Space, Avatar } from "antd";
import { AiOutlineUser } from "react-icons/ai";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar-logout";
import { useAuth } from "@/hooks";
import { useSelector } from "react-redux";
import { getMode } from "@/redux/selector";
import { useMemo } from "react";

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const { profile, logout } = useAuth({ revalidateOnMount: true });
  const isUser = useMemo(() => profile && !profile.Role, [profile]);
  return (
    <div>
      {profile?.email && (
        <div className="flex items-center py-1 px-2">
          <div className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </div>
          <div className="text-white font-medium text-sm px-3 flex hover:text-blue-900 transition-all">
            Hi
            <MenuNavbarLogout options={{ placement: "bottomRight" }} />
          </div>
        </div>
      )}
    </div>
  );
}
