"use client";

import { useAuth, userRandomBgLinearGradient } from "@/hooks";
import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { Badge, Button, Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCaretRight, AiOutlineEye } from "react-icons/ai";
import { CiLocationArrow1, CiLocationOn } from "react-icons/ci";
import ImageWithFallback from "../img/ImageWithFallback";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toast as toastify } from "react-toastify";

export interface IItemHealthFacilitiesProps {
  healthFaicility: HealthFacility;
  handleClickItem: (healthFaicility: HealthFacility) => void;
}

export function ItemHealthFacility({
  healthFaicility,
  handleClickItem,
}: IItemHealthFacilitiesProps) {
  const router = useRouter();
  const { profile } = useAuth();
  function handleClickBooking(id: string) {
    if (profile?.id) {
      router.push(`/booking?healthFacilityId=${id}`);
    } else {
      toastify.warn("Hãy đăng nhập để đặt lịch!");
    }
  }

  return (
    <div
      key={healthFaicility.id}
      className="rounded-lg  shadow pb-4 overflow-hidden"
    >
      <div className="flex-shrink-0 shadow-md  flex h-[254px] items-center justify-center rounded-md">
        <ImageWithFallback
          alt="Health Facility"
          width={386}
          height={254}
          src={healthFaicility.images?.[0] || ""}
          className="w-full h-full  object-cover hover:scale-105 transition-all "
        />
      </div>
      <div className="py-4  p-4">
        <div className="flex items-start justify-between">
          <h4
            className="text-base font-semibold text-[#0d0c22]  max-w-[68%] h-[50px]"
            onClick={() => handleClickItem(healthFaicility)}
          >
            <span className="">{healthFaicility.name} </span>
            <span className="px-2 py-1 text-[10px] relative top-[-2px] font-semibold text-white bg-blue-500 rounded-lg ml-1 ">
              HOT
            </span>
          </h4>

          <span className="min-w-[106px]">
            <Rate
              className="text-sm"
              tooltips={["terrible", "bad", "normal", "good", "wonderful"]}
              value={Math.random() > 0.5 ? 5 : 4}
              disabled
            />
          </span>
        </div>
        {/* //text-ellipsis overflow-clip whitespace-nowrap */}
        <p className="text-sm font-normal text-gray-500 flex items-start gap-1 my-1">
          <span className="pt-[2px] text-base mr-1 flex items-center">
            <CiLocationOn />
          </span>
          {healthFaicility.address}
        </p>
        <p className="text-sm font-normal text-gray-500 flex items-start gap-1 my-1">
          <span className="pt-[2px] flex items-center text-base mr-1">
            <AiOutlineCaretRight />
          </span>
          {healthFaicility.TypeHealthFacility.name}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-1 px-4">
        {/* <div
          href={`/booking?healthFacilityId=${healthFaicility.id}`}
          className="flex-1"
        >
         
        </div> */}
        <Button
          type="dashed"
          className="w-full"
          onClick={() => handleClickBooking(healthFaicility.id)}
        >
          Đặt khám ngay
        </Button>
        <Link href={`/health-facility/${healthFaicility.id}`}>
          <Button type="dashed" className="w-full">
            <AiOutlineEye size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
