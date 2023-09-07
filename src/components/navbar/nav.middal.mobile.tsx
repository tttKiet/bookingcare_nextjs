import { MenuItem } from "@/types";
import Link from "next/link";

export interface ControlMiddalNavMobileProps {
  menu: MenuItem[];
}

export function ControlMiddalNavMobile({ menu }: ControlMiddalNavMobileProps) {
  return (
    <div className="py-2 flex-1 ">
      <div className="">
        {menu &&
          menu.map((menu) => (
            <Link
              href={menu.href}
              key={menu.href}
              className="text-sm block py-2 font-medium  text-blue-900  hover:text-blue-700 transition-colors cursor-pointer duration-200"
            >
              <span>{menu.title}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
