import { Space, Avatar } from "antd";
import * as React from "react";
import { AiOutlineUser } from "react-icons/ai";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar-logout";
import { useAuth } from "@/hooks";

export interface ProfileProps {}

export function Profile(props: ProfileProps) {
  const { profile, logout } = useAuth({ revalidateOnMount: true });
  return (
    <div>
      {profile?.email && (
        <div className="flex items-center py-1 px-2">
          <Space>
            <Avatar
              size={30}
              crossOrigin={"use-credentials"}
              icon={<AiOutlineUser />}
              className="flex items-center justify-center text-base bg-transparent rounded-full border-[2px] border-pink-500 text-black"
            />
          </Space>
          <div className=" font-medium text-sm px-3 flex hover:text-blue-800 transition-all">
            Hi
            <MenuNavbarLogout options={{ placement: "bottomLeft" }} />
          </div>
        </div>
      )}
    </div>
  );
}
