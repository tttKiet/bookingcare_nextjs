import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { Badge } from "antd";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { CiLocationArrow1, CiLocationOn } from "react-icons/ci";

export interface IItemHealthFacilitiesProps {
  healthFaicility: HealthFacility;
  handleClickItem: (healthFaicility: HealthFacility) => void;
}

export function ItemHealthFacility({
  healthFaicility,
  handleClickItem,
}: IItemHealthFacilitiesProps) {
  return (
    <Badge.Ribbon
      text={
        <Link
          href={`/booking?healthFacilityId=${healthFaicility.id}`}
          className="py-1 px-4 cursor-pointer"
        >
          Đặt khám ngay
        </Link>
      }
    >
      <div
        key={healthFaicility.id}
        className="flex items-start justify-start gap-2 border rounded-lg shadow p-4 bg-white mb-3"
      >
        <div className="rounded-full flex-shrink-0  border-white  shadow border-2">
          <Image
            alt="Health Facility"
            src={healthFaicility.images?.[0] || ""}
            width={160}
            height={160}
            className="w-[60px] h-[60px] shadow  object-cover rounded-full"
          />
        </div>
        <div>
          <h4
            className="text-base font-normal text-blue-500 mb-1 cursor-pointer"
            onClick={() => handleClickItem(healthFaicility)}
          >
            {healthFaicility.name}
          </h4>
          <p className="text-sm text-gray-400 flex items-start gap-1">
            <span className="pt-[2px] text-base mr-1 flex items-center">
              <CiLocationOn />
            </span>
            {healthFaicility.address}
          </p>
          <p className="text-sm text-gray-400 flex items-start gap-1">
            <span className="pt-[2px] flex items-center text-base mr-1">
              <AiOutlineCaretRight />
            </span>
            {healthFaicility.TypeHealthFacility.name}
          </p>
        </div>
      </div>
    </Badge.Ribbon>
  );
}
