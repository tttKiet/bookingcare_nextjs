"use client";

import { API_WORKING } from "@/api-services/constant-api";
import { Working } from "@/models";
import { ResDataPaginations } from "@/types";
import { Button, Card, CardBody, Chip, Image } from "@nextui-org/react";
import { useMemo } from "react";
import useSWR from "swr";
import Slider from "react-slick";
import moment from "moment";
import { BiSolidPhone } from "react-icons/bi";
import IconBgGray from "./IconBgGray";
import { MdOutlineMail } from "react-icons/md";
import AddressFromApi from "./AddressFromApi";
import { IoLocationOutline } from "react-icons/io5";
import { useAuth } from "@/hooks";

export default function WorkingStaff() {
  const { data, mutate: mutateWorking } =
    useSWR<ResDataPaginations<Working>>(API_WORKING);
  const { profile } = useAuth();
  const workingData: Working = useMemo(() => {
    return data?.rows?.[0];
  }, [data]);
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };
  return (
    <div className="flex gap-2">
      <div className="py-2 pb-3">
        <div className="w-[250px] h-[250px] ">
          <Slider {...settings} className="">
            {workingData?.HealthFacility?.images?.map((url) => {
              return (
                <div className="p-1  ">
                  <Image
                    key={url}
                    alt="Health"
                    className="object-cover w-[246px] h-[246px] "
                    height={246}
                    width={246}
                    src={url}
                    radius="sm"
                  />
                </div>
              );
            })}
          </Slider>
        </div>
      </div>

      <div className="py-2 pb-3 ml-8 flex-1">
        <div className="grid gap-3 grid-cols-12">
          <h4 className="col-span-12">
            <div className="font-medium text-xl text-[#000] flex items-center gap-3 justify-between">
              <span>{workingData?.HealthFacility?.name?.toUpperCase()}</span>
            </div>
            <div className=" text-xs text-left text-gray-600 col-span-12 mt-1 mb-2">
              Đã tạo ngày{" "}
              {moment(workingData?.HealthFacility?.createdAt).format("L")}
            </div>
          </h4>
          <div className="grid gap-3 grid-cols-12 col-span-5">
            <h4 className="font-medium text-base text-[#000]/80 col-span-12 flex items-center gap-1">
              <span>
                <IconBgGray size="sm" bg="bg-[#F7B750]">
                  <BiSolidPhone color="#6d6d6d" />
                </IconBgGray>
              </span>
              <span> {workingData?.HealthFacility?.phone}</span>
            </h4>
            <h4 className="font-medium text-base text-[#000]/80 col-span-12 flex items-center gap-1">
              <span>
                <IconBgGray size="sm" bg="bg-[#F7B750]">
                  <MdOutlineMail color="#6d6d6d" />
                </IconBgGray>
              </span>
              <span> {workingData?.HealthFacility?.email}</span>
            </h4>
            <h4 className="font-medium text-base text-[#000]/80 col-span-12 flex items-center gap-1">
              <span>
                <IconBgGray size="sm" bg="bg-[#F7B750]">
                  <IoLocationOutline color="#6d6d6d" />
                </IconBgGray>
              </span>
              <span>{workingData?.HealthFacility?.address}</span>
            </h4>
          </div>
          <div className="col-span-7 ">
            <div className="grid grid-cols-2 gap-1 ">
              <span className="mr-1 text-right">Vai trò của bạn: </span>
              {profile?.Role?.keyType == "doctor" ? (
                <Chip
                  color="primary"
                  variant="flat"
                  radius="sm"
                  className="font-medium"
                  size="sm"
                >
                  BÁC SĨ
                </Chip>
              ) : (
                <Chip
                  color="secondary"
                  variant="flat"
                  radius="sm"
                  className="font-medium"
                  size="sm"
                >
                  NHÂN VIÊN
                </Chip>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <span className="mr-1 text-right">Trạng thái: </span>
              <Chip color="primary" radius="sm" size="sm">
                Hoạt động
              </Chip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
