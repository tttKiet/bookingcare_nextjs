import { userRandomBgLinearGradient } from "@/hooks";
import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { Badge, Button, Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { AiOutlineCaretRight, AiOutlineEye } from "react-icons/ai";
import { CiLocationArrow1, CiLocationOn } from "react-icons/ci";
import ImageWithFallback from "../img/ImageWithFallback";

export interface IItemHealthFacilitiesProps {
  healthFaicility: HealthFacility;
  handleClickItem: (healthFaicility: HealthFacility) => void;
}

export function ItemHealthFacility({
  healthFaicility,
  handleClickItem,
}: IItemHealthFacilitiesProps) {
  const [bg] = userRandomBgLinearGradient();
  return (
    <div key={healthFaicility.id} className="rounded-lg ">
      <div
        style={{ backgroundImage: bg }}
        className="flex-shrink-0 p-6 flex h-[250px] items-center justify-center rounded-md"
      >
        <ImageWithFallback
          alt="Health Facility"
          width={160}
          height={160}
          src={healthFaicility.images?.[0] || ""}
          className="w-full h-full  shadow   rounded-md object-cover "
        />
      </div>
      <div className="py-2">
        <div className="flex items-start justify-between">
          <h4
            className="text-base font-normal text-[#0d0c22]  max-w-[80%]"
            onClick={() => handleClickItem(healthFaicility)}
          >
            <span className="">{healthFaicility.name} </span>
            <span className="px-2 py-1 text-[10px] relative top-[-2px] font-semibold text-white bg-gray-500/80 rounded-lg ml-1">
              HOT
            </span>
          </h4>

          <span>
            <Rate
              className="text-sm"
              tooltips={["terrible", "bad", "normal", "good", "wonderful"]}
              value={Math.random() > 0.5 ? 5 : 4}
              disabled
            />
          </span>
        </div>
        {/* //text-ellipsis overflow-clip whitespace-nowrap */}
        <p className="text-sm font-normal text-[#6e6d7a] flex items-start gap-1">
          <span className="pt-[2px] text-base mr-1 flex items-center">
            <CiLocationOn />
          </span>
          {healthFaicility.address}
        </p>
        <p className="text-sm font-normal text-[#6e6d7a] flex items-start gap-1">
          <span className="pt-[2px] flex items-center text-base mr-1">
            <AiOutlineCaretRight />
          </span>
          {healthFaicility.TypeHealthFacility.name}
        </p>
      </div>
      <div className="flex justify-center gap-2 mt-1">
        <Link
          href={`/booking?healthFacilityId=${healthFaicility.id}`}
          className="flex-1"
        >
          <Button type="dashed" className="w-full">
            Đặt khám ngay
          </Button>
        </Link>
        <Link href={`/health-facility/${healthFaicility.id}`}>
          <Button type="dashed" className="w-full">
            <AiOutlineEye size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
