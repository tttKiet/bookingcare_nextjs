"use client";

import { useAuth, userRandomBgLinearGradient } from "@/hooks";
import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { Rate } from "antd";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCaretRight, AiOutlineEye } from "react-icons/ai";
import { CiLocationArrow1, CiLocationOn } from "react-icons/ci";
import ImageWithFallback from "../img/ImageWithFallback";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toast as toastify } from "react-toastify";
import { Button } from "@nextui-org/button";
import { Chip, Tooltip } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { PulseLoader } from "react-spinners";
import { LiaCitySolid } from "react-icons/lia";

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
  const [address, setAddress] = useState<string>("");
  const [left2, setLeft2] = useState<string>("");
  const [p, setP] = useState<string>("");

  useEffect(() => {
    useGetAddress({
      wardCode: healthFaicility?.addressCode[0] || "",
      districtCode: healthFaicility?.addressCode[1] || "",
      provinceCode: healthFaicility?.addressCode[2] || "",
    })
      .then((ob) => {
        setAddress(ob.address);
        setLeft2(`${ob.values.ward}, ${ob.values.district}`);
        setP(ob.values.province);
      })
      .catch((e) => "");
  }, [
    healthFaicility?.addressCode[0],
    healthFaicility?.addressCode[1],
    healthFaicility?.addressCode[2],
  ]);
  return (
    <div
      key={healthFaicility.id}
      className="rounded-lg shadow pb-4 overflow-hidden"
    >
      <div className="flex-shrink-0 shadow-md flex h-[160px] items-center justify-center rounded-md">
        <ImageWithFallback
          alt="Health Facility"
          width={270}
          height={250}
          src={healthFaicility.images?.[0] || ""}
          className="w-full h-full  object-cover hover:scale-105 transition-all "
        />
      </div>
      <div className="py-4 p-4">
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className="whitespace-normal"
          startContent={<CiLocationOn />}
          radius="sm"
          // className="text-sm font-medium text-black flex items-start gap-1 my-1"
        >
          {left2 || <PulseLoader color="gray" size={4} />}
        </Chip>
        <Chip
          color="primary"
          variant="flat"
          size="sm"
          className="whitespace-normal mt-1"
          startContent={<LiaCitySolid />}
          radius="sm"
          // className="text-sm font-medium text-black flex items-start gap-1 my-1"
        >
          {p || <PulseLoader color="gray" size={4} />}
        </Chip>
        <div className="flex items-start justify-between mt-2">
          <Tooltip
            color="default"
            content={
              <div className="px-1 py-2">
                <div className="text-small font-bold">Cơ sở y tế</div>
                <div className="text-tiny">{healthFaicility.name}</div>
              </div>
            }
            // className="capitalize"
          >
            <h4
              className="text-base font-bold text-[#1b3c74] whitespace-nowrap text-ellipsis overflow-x-hidden max-w-[252px]"
              onClick={() => handleClickItem(healthFaicility)}
            >
              {healthFaicility.name}
            </h4>
          </Tooltip>
        </div>

        <div className="text-sm font-medium  text-[rgb(60,66,83)]/90 flex items-center gap-1 my-2">
          <AiOutlineCaretRight />
          {healthFaicility.TypeHealthFacility.name}
        </div>
        <div className="text-sm font-medium  text-[rgb(60,66,83)] ">
          <div className="font-bold text-[#1b3c74]">Hoạt động:</div>
          <div className="mt-2 text-[rgb(60,66,83)]/90">
            <span>
              <span>Sáng: </span>
              <Chip color="warning" variant="flat" size="sm" radius="sm">
                7h - 11h
              </Chip>
            </span>
            <span className="pl-2">
              <span>Chiều: </span>
              <Chip color="warning" variant="flat" size="sm" radius="sm">
                11h - 5h
              </Chip>
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-2 px-4">
        {/* <div
          href={`/booking?healthFacilityId=${healthFaicility.id}`}
          className="flex-1"
        >
         
        </div> */}
        <Button
          color="primary"
          className="w-full"
          onClick={() => handleClickBooking(healthFaicility.id)}
        >
          Đặt khám ngay
        </Button>
        <Link href={`/health-facility/${healthFaicility.id}`}>
          <Button className="w-5 ">
            <AiOutlineEye size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
