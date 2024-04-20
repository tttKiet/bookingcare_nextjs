"use client";

import { useAuth } from "@/hooks";
import { DropdownProps } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AiOutlinePoweroff } from "react-icons/ai";
import { PiUserCircleLight } from "react-icons/pi";
import { RiBillLine } from "react-icons/ri";
import { toast } from "react-toastify";
import MenuDropdown from ".";
import { ModalPositionHere } from "../modal";

export interface MenuNavbarLogoutProps {
  options?: DropdownProps;
}

export default function MenuNavbarLogout({ options }: MenuNavbarLogoutProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const items = useMemo(() => {
    return [
      {
        gr: "Chuyến hướng",
        data: [
          {
            key: "profile",
            label: (
              <Link href="/user" className="">
                Hồ sơ bệnh nhân
              </Link>
            ),
            icon: <PiUserCircleLight size={20} />,
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
            show: !(profile?.Role || false),
          },
        ],
      },
      {
        gr: "Hành động",
        data: [
          {
            key: "logout",
            danger: true,
            label: "Đăng xuất",
            icon: (
              <span className="flex items-center">
                <AiOutlinePoweroff size={20} />
              </span>
            ),
            onClick: toggleShowModalConfirm,
          },
        ],
      },
    ];
  }, []);

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
        items={items}
        title={profile?.fullName || ""}
        titleType="text-white font-bold ml-1"
      />
    </div>
  );
}
