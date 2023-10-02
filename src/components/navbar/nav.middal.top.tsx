"use client";

import * as React from "react";
import Link from "next/link";
import { MenuItem } from "@/types";
import { usePathname } from "next/navigation";

export interface ControlMiddalNavTopProps {
  menu: MenuItem[];
}

export function ControlMiddalNavTop({ menu }: ControlMiddalNavTopProps) {
  const pathName = usePathname();
  return (
    <div className="py-2 flex-1 ">
      <div className="flex items-center justify-start gap-4 ">
        {menu &&
          menu.map((menu, i) => (
            <Link
              href={menu.href}
              key={i}
              passHref={true}
              className={`text-sm font-medium p-1 px-4 hover:text-blue-700 transition-colors cursor-pointer duration-200
                ${
                  pathName == menu.href
                    ? "text-white bg-blue-600/70 border rounded-xl"
                    : "text-blue-900"
                }
              `}
            >
              {menu.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
