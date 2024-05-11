"use client";

import { useAuth } from "@/hooks";
import { DropdownProps } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AiOutlinePoweroff } from "react-icons/ai";
import { PiUserCircleLight } from "react-icons/pi";
import { RiBillLine, RiFolderUserLine } from "react-icons/ri";
import { toast } from "react-toastify";
import MenuDropdown from ".";
import { ModalPositionHere } from "../modal";
import { FaRegCircleUser } from "react-icons/fa6";
// import { TagNames } from "@/app/user/page";
import { HiOutlineCalendar, HiOutlineNewspaper } from "react-icons/hi";
import { HiChatBubbleBottomCenterText } from "react-icons/hi2";

export interface MenuNavbarLogoutProps {
  options?: DropdownProps;
}

const TagNames = {
  ONE: "patient-profile",
  TWO: "add-patient-profile",
  FOUR: "booking",
  FIVE: "account",
  SIX: "medical-record",
  SERVEN: "result",
  EIGHT: "chat",
};

export default function MenuNavbarLogout({ options }: MenuNavbarLogoutProps) {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const items = useMemo(() => {
    return [
      {
        gr: "Tôi",
        data: [
          {
            key: `/user?tag=${TagNames.FIVE}`,
            label: (
              <Link className="font-medium" href={`/user?tag=${TagNames.FIVE}`}>
                Tài khoản của bạn
              </Link>
            ),
            icon: <FaRegCircleUser size={18} />,
            show: !(profile?.Role || false),
          },
        ],
      },
      {
        gr: "Chat",
        data: [
          {
            key: `/user?tag=${TagNames.EIGHT}`,
            label: (
              <Link
                className="font-medium"
                href={`/user?tag=${TagNames.EIGHT}`}
              >
                Chát với bác sĩ
              </Link>
            ),
            icon: <HiChatBubbleBottomCenterText size={18} />,
            show: !(profile?.Role || false),
          },
        ],
      },
      {
        gr: "Hồ sơ",
        data: [
          {
            key: "profile",
            label: (
              <Link href={`/user?tag=${TagNames.ONE}`} className="">
                Hồ sơ bệnh nhân
              </Link>
            ),
            icon: <RiFolderUserLine size={20} />,
            show: !(profile?.Role || false),
          },
          {
            key: "health-record",
            label: (
              <Link href={`/user?tag=${TagNames.FOUR}`} className="">
                Lịch hẹn khám
              </Link>
            ),
            icon: (
              <span className="flex items-center">
                <HiOutlineCalendar size={20} />
              </span>
            ),
            show: !(profile?.Role || false),
          },
          {
            key: `/user?tag=${TagNames.SERVEN}`,
            label: (
              <Link href={`/user?tag=${TagNames.SERVEN}`} className="">
                Kết quả khám bệnh
              </Link>
            ),
            icon: (
              <span className="flex items-center">
                <HiOutlineNewspaper size={20} />
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
