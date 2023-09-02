import * as React from "react";
import { useAuth } from "@/hooks";
import { PiUserCircleLight } from "react-icons/pi";
import { AiOutlinePoweroff } from "react-icons/ai";
import Link from "next/link";
import { ModalPositionHere } from "../modal";
import MenuDropdown from ".";
import toast from "react-hot-toast";
import { Button } from "antd";

export interface MenuNavbarLogoutProps {}

export default function MenuNavbarLogout(props: MenuNavbarLogoutProps) {
  const { profile, logout } = useAuth();
  const [showConfirm, setShowConfirm] = React.useState<boolean>(false);
  const items = React.useMemo(() => {
    return [
      {
        key: "profile",
        label: (
          <Link rel="/profile" href="/profile" className="px-1">
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
        options={{ placement: "bottom", arrow: true }}
        title={profile?.fullName || ""}
        titleType="text-blue-600 ml-1"
      />
    </div>
  );
}