"use client";

import { useAuth } from "@/hooks";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";
import { AiOutlinePoweroff } from "react-icons/ai";
import { PiUserCircleLight } from "react-icons/pi";
import MenuDropdown from ".";
import { ModalPositionHere } from "../modal";
import { DropDownProps } from "antd";

export interface MenuNavbarLogoutProps {
  options?: DropDownProps;
}

export default function MenuNavbarLogout({ options }: MenuNavbarLogoutProps) {
  const { profile, logout } = useAuth();
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);
  const items = React.useMemo(() => {
    return [
      {
        key: "profile",
        label: (
          <Link href="/" className="px-1">
            Hồ sơ
          </Link>
        ),
        icon: <PiUserCircleLight size={20} />,
        className: "w-44 mb-1",
      },
      {
        key: "logout",
        danger: true,
        label: "Đăng xuất",
        className: "border-t mb-1 rounded-none",
        icon: <AiOutlinePoweroff size={20} />,
        onClick: toggleShowModalConfirm,
      },
    ];
  }, []);

  function toggleShowModalConfirm() {
    setShowConfirm((s) => !s);
  }

  async function handleLogout(): Promise<void> {
    await logout();
    toast.success("Đã đăng xuất");
  }

  return (
    <div className="">
      <ModalPositionHere
        body={<p className="mt-4">Bạn chắc chắn muốn đăng xuất?</p>}
        contentBtnCancel="Hủy"
        title="Đăng xuất khỏi hệ thống"
        show={showConfirm}
        contentBtnSubmit="Đăng xuất ngay"
        handleSubmit={handleLogout}
        toggle={toggleShowModalConfirm}
      />
      <MenuDropdown
        items={items}
        options={{ placement: "bottom", arrow: true, ...options }}
        title={profile?.fullName || ""}
        titleType="text-blue-600 ml-1"
      />
    </div>
  );
}
