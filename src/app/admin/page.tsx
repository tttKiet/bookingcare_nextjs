"use client";

import { TotalDashBoardHealthFacilitiesAdmin } from "@/components/common";
import { Image } from "@nextui-org/image";
import bg1 from "../../assets/images/doctor/bg-img-01.png";
import img1 from "../../assets/images/doctor/img1.png";
export default function Admin() {
  return (
    <div className="relative">
      <div
        style={{
          position: "absolute",
          backgroundImage: `url(${bg1.src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          width: "100%",
          height: "100%",
          zIndex: "[-1]",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          zIndex: "[-1]",
        }}
      >
        <Image src={img1.src} />
      </div>
      <div className="box-white ">
        <div className="flex items-center flex-wrap py-6">
          <div className="w-1/2 text-left">
            <h2 className="text-[26px] font-semibold mb-1">
              Good Morning, <span className="text-[#2E37A4] ">Admin</span>
            </h2>
            <span className="text-base text-gray-500">
              Have a nice day at work
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
