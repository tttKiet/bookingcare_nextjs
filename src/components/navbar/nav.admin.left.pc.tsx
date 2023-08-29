"use client";
import { NAV_ADMIN_WIDTH } from "@/contrains";
import Link from "next/link";
import * as React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdSupervisorAccount } from "react-icons/md";
import { LiaUserNurseSolid } from "react-icons/lia";
import { useSelectedLayoutSegment } from "next/navigation";
import { isNumericLiteral } from "typescript";

export interface NavAdminPcProps {}

export function NavAdminPc(props: NavAdminPcProps) {
  const menuMain = React.useMemo(
    () => [
      {
        title: "Tổng quan",
        href: "/admin",
        icon: <LuLayoutDashboard size={20} />,
      },
      {
        title: "Tài khoản",
        href: "/admin/tai-khoan",
        icon: <MdSupervisorAccount size={20} />,
      },
      {
        title: "Cơ sở y tế",
        href: "/admin/co-so-y-te",
        icon: <FiPlusCircle size={20} />,
      },

      {
        title: "Bác sỉ",
        href: "/admin/bac-si",
        icon: <LiaUserNurseSolid size={20} />,
      },
      {
        title: "Lịch làm việc",
        href: "/admin/lich-lam-viec",
        icon: <FiPlusCircle size={20} />,
      },
    ],
    []
  );
  const segment = useSelectedLayoutSegment();
  const activeLink = "bg-[#ffffff3b]";
  return (
    <div className="nav-admin-width bg-blue-500 fixed top-0 left-0 bottom-0 h-full py-6">
      <Link
        href={"/admin"}
        className="flex items-center justify-center gap-1 text-xl font-medium text-white"
      >
        BOOKING CARE
      </Link>
      <div className="flex flex-col gap-3 px-4 justify-center items-start mt-12">
        {menuMain.map((link) => (
          <Link
            className={`
              flex justify-start items-center gap-2 w-full text-base font-medium px-3 py-1 rounded-md text-white
              hover:bg-[#ffffff3b]
               transition-all duration-300
              ${segment && link.href.includes(segment) ? activeLink : ""}
              ${segment === null && link.href === "/admin" ? activeLink : ""}
            `}
            key={link.href}
            href={link.href}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
