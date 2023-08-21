import * as React from "react";
import { useAuth } from "@/hooks";
import { PiUserCircleLight } from "react-icons/pi";
import { AiOutlinePoweroff } from "react-icons/ai";
import Link from "next/link";
import { ModalPositionHere } from "../modal";
import MenuDropdown from ".";
import toast from "react-hot-toast";

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
            Profile
          </Link>
        ),
        icon: <PiUserCircleLight size={20} />,
        className: "w-44",
      },
      {
        key: "logout",
        danger: true,
        label: "Logout",
        className: "border-t",
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
    toast.success("Logged out.");
  }

  return (
    <div className="">
      <ModalPositionHere
        body="Bạn chắc chắn muốn đăng xuất?"
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
        title={profile?.data?.email}
        titleType="text-blue-600 ml-1"
      />
    </div>
  );
}
