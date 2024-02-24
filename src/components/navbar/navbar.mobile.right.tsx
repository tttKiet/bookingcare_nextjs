"use client";

import { Avatar, Button, Drawer, Space } from "antd";
import { Btn } from "../button";
import { ControlMiddalNavMobile } from "./nav.middal.mobile";
import { MenuItem } from "@/types";
import { FiFacebook, FiYoutube } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { useAuth } from "@/hooks";
import { AiOutlinePoweroff, AiOutlineUser } from "react-icons/ai";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar-logout";
import Link from "next/link";
import { PiUserCircleLight } from "react-icons/pi";
import toast from "react-hot-toast";
import { ModalPositionHere } from "../modal";
import { useMemo, useState } from "react";

export interface NavBarMobileProps {
  open: boolean;
  onClose: () => void;
  toggleShowModalRegister: () => void;
  toggleShowModal: () => void;
  menu: MenuItem[];
}

export function NavBarMobile({
  open,
  onClose,
  toggleShowModalRegister,
  toggleShowModal,
  menu,
}: NavBarMobileProps) {
  const { profile, logout } = useAuth({ revalidateOnMount: true });
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  async function handleLogout(): Promise<void> {
    await logout();
    toast.success("Đã đăng xuất");
    toggleShowModalConfirm();
    onClose();
  }
  function toggleShowModalConfirm() {
    setShowConfirm((s) => !s);
  }
  const items = useMemo(() => {
    return [
      {
        key: "profile",
        label: "Hồ sơ",
        icon: <PiUserCircleLight size={22} />,
      },
    ];
  }, []);
  const block =
    "rounded-md shadow-md bg-white border border-white-400 p-2 px-4 mb-4";
  const blockBtn = "rounded-md mb-4";
  return (
    <Drawer
      title="Booking Care"
      placement="right"
      closable={true}
      onClose={onClose}
      open={open}
      key="nav_mobile"
      footer={
        <div className="flex flex-col gap-1 items-center">
          {profile?.email && (
            <Button danger onClick={toggleShowModalConfirm} className="w-full">
              Đăng xuất
            </Button>
          )}
          <p className="text-[11px] text-gray-500/70  text-left font-medium ">
            Design by Bui Kiet - CTUter 2023 - v1.0.0
          </p>
        </div>
      }
    >
      <div>
        <ModalPositionHere
          body={<p className="mt-4">Bạn chắc chắn muốn đăng xuất?</p>}
          contentBtnCancel="Hủy"
          title="Đăng xuất khỏi hệ thống"
          show={showConfirm}
          contentBtnSubmit="Đăng xuất ngay"
          handleSubmit={handleLogout}
          toggle={toggleShowModalConfirm}
        />
        {!profile?.email && (
          <div className={`flex items-center gap-2 justify-start ${blockBtn}`}>
            <Btn
              title="Register"
              options={{
                size: "middle",
                type: "default",
                shape: "default",
                onClick: toggleShowModalRegister,
              }}
            />
            <Btn
              title="Login"
              options={{
                size: "middle",
                type: "primary",
                shape: "default",
                onClick: toggleShowModal,
              }}
            />
          </div>
        )}
        {profile?.email && (
          <div className="">
            <div className={`flex items-center ${block}`}>
              <Space>
                <Avatar
                  size={30}
                  crossOrigin={"use-credentials"}
                  icon={<AiOutlineUser />}
                  className="flex items-center justify-center text-base bg-transparent rounded-full border-[2px] border-pink-500 text-black"
                />
              </Space>
              <div className="text-blue-500 font-medium text-sm px-3 flex hover:text-blue-800 transition-all">
                {profile?.fullName}
              </div>
            </div>
            <div className={`${block}`}>
              <h4 className="text-gray-500 text-xs font-medium ">Cá nhân</h4>
              <div className="py-2">
                {items.map((item) => {
                  return (
                    <Link
                      key={item.key}
                      href={"/profile"}
                      className="text-sm flex justify-between items-center  py-2 font-medium  text-blue-900  hover:text-blue-700 transition-colors cursor-pointer duration-200"
                    >
                      {item.label}
                      {item.icon}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div className={`${block}`}>
          <h4 className="text-gray-500 text-xs font-medium">Điều khiển</h4>
          {/* List menu */}
          <ControlMiddalNavMobile menu={menu} />
        </div>
        <div className={`${block}`}>
          <h4 className="text-gray-500 pb-4 text-xs font-medium">
            Kênh truyền thông
          </h4>
          <div className="flex items-center gap-2">
            <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-blue-500 hover:text-white text-blue-500 transition-all hover:scale-110">
              <FiFacebook size={16} />
            </div>
            <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-black hover:text-white text-black transition-all hover:scale-110">
              <FaTiktok size={16} />
            </div>
            <div className="border  rounded-lg p-2 px-3 cursor-pointer hover:bg-red-500 hover:text-white text-red-500 transition-all hover:scale-110">
              <FiYoutube className="" size={16} />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
