"use client";

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
              className={`text-sm p-1 px-4 relative hover:text-white transition-colors cursor-pointer duration-200
                ${
                  pathName == menu.href
                    ? "transition-all duration-200 text-white font-semibold before:absolute before:top-full before:left-0 before:w-[60%] before:h-1 before:block before:content before:bg-white before:rounded-lg before:animate-bounce "
                    : "text-gray-200"
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
