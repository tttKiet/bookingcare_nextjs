import * as React from "react";
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
          menu.map((menu, i) => (
            <Link
              href={menu.href}
              key={i}
              passHref={true}
              className="text-sm font-medium text-blue-900  hover:text-blue-700 transition-colors cursor-pointer duration-200"
            >
              {menu.title}
            </Link>
          ))}
      </div>
    </div>
  );
}
