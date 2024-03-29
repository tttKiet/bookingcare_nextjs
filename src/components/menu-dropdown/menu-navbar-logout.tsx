"use client";

import { useAuth } from "@/hooks";
import Link from "next/link";
import { AiOutlinePoweroff } from "react-icons/ai";
import { PiUserCircleLight } from "react-icons/pi";
import MenuDropdown from ".";
import { ModalPositionHere } from "../modal";
import { DropDownProps } from "antd";
import { RiBillLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";

export interface MenuNavbarLogoutProps {
  options?: DropDownProps;
}

export default function MenuNavbarLogout({ options }: MenuNavbarLogoutProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const items = useMemo(() => {
    return [
      {
        key: "profile",
        label: (
          <Link href="/user" className="">
            Hồ sơ bệnh nhân
          </Link>
        ),
        icon: <PiUserCircleLight size={20} />,
        className: "w-44 mb-1",
        show: !(profile?.Role || false),
      },
      {
        key: "health-record",
        label: (
          <Link href="/user/health-record/" className="">
            Phiếu khám bệnh
          </Link>
        ),
        icon: (
          <span className="flex items-center">
            <RiBillLine size={20} />
          </span>
        ),
        className: "w-44 mb-1 items-center",
        show: !(profile?.Role || false),
      },
      {
        key: "admin",
        label: "Admin",
        icon: <PiUserCircleLight size={20} />,
        className: "w-44 mb-1",
        show: !!profile?.Role || false,
      },
      {
        key: "logout",
        danger: true,
        label: "Đăng xuất",
        className: "border-t mb-1 rounded-none",
        icon: (
          <span className="flex items-center">
            <AiOutlinePoweroff size={20} />
          </span>
        ),
        onClick: toggleShowModalConfirm,
      },
    ];
  }, []);
  const itemsFilter = useMemo(
    () =>
      items
        .filter((s) => !(s.show == false))
        .map((i) => {
          const item = { ...i };
          if (item.hasOwnProperty("show")) delete item.show;
          return {
            ...item,
          };
        }),
    [items]
  );

  function toggleShowModalConfirm() {
    setShowConfirm((s) => !s);
  }

  async function handleLogout(): Promise<void> {
    if (profile?.Role?.keyType !== "user") {
      router.push("/");
    }
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
        items={itemsFilter}
        options={{ placement: "bottom", arrow: true, ...options }}
        title={profile?.fullName || ""}
        titleType="text-white font-bold ml-1"
      />
    </div>
  );
}
