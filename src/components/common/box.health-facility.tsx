import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { Badge, Divider } from "antd";
import Image from "next/image";
import * as React from "react";
import { AiOutlineCaretRight } from "react-icons/ai";
import { CiLocationArrow1, CiLocationOn } from "react-icons/ci";

export interface IBoxHealthFacilitiesProps {
  healthFaicility: HealthFacility | null;
}

export function BoxHealthFacility({
  healthFaicility,
}: IBoxHealthFacilitiesProps) {
  if (!healthFaicility) {
    return <></>;
  }
  return (
    <div
      key={healthFaicility.id}
      className="rounded-lg shadow p-4 bg-white mb-3"
    >
      <div className="flex justify-center flex-shrink-0  ">
        <Image
          alt="Health Facility"
          src={healthFaicility.images?.[0] || ""}
          width={160}
          height={160}
          className="w-[260px] h-[260px] shadow  object-cover "
        />
      </div>
      <div>
        <h4 className="text-base font-normal py-2 text-blue-500 text-center">
          {healthFaicility.name}
        </h4>
        <p className="text-sm text-gray-400 flex items-start gap-1">
          <span className="inline-block text-base mr-1">
            <CiLocationOn />
          </span>
          <span> {healthFaicility.address}</span>
        </p>
        <p className="text-sm text-gray-400 flex items-start gap-1">
          <span className="inline-block text-base mr-1">
            <AiOutlineCaretRight />
          </span>
          {healthFaicility.TypeHealthFacility.name}
        </p>
        <Divider />
        <span className="text-sm text-gray-500">... đang cập nhật</span>
      </div>
    </div>
  );
}
