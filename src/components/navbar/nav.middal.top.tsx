import * as React from "react";
import { FiFacebook, FiYoutube } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { MenuItem } from "@/types";

export interface ControlMiddalNavTopProps {
  menu: MenuItem[];
}

export function ControlMiddalNavTop({ menu }: ControlMiddalNavTopProps) {
  return (
    <div className="py-2 flex-1 ">
      <div className="flex items-center justify-start gap-6 ">
        {menu &&
          menu.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className="text-sm font-medium text-blue-900  hover:text-blue-700 transition-colors cursor-pointer duration-200"
            >
              <span>{menu.title}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
