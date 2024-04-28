"use client";

import {
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_HEALTH_FACILITIES,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import instances from "@/axios";
import { WorkRoomAndSchedule } from "@/components/common/step-boking";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthFacility, ScheduleFilterDoctor } from "@/models";
import { ResDataPaginations } from "@/types";
import { Image } from "@nextui-org/image";
import { Chip, Divider, Tab, Tabs } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import Slider from "react-slick";
import { PulseLoader } from "react-spinners";
import useSWR, { BareFetcher } from "swr";
import { AnimatePresence, motion, Variants } from "framer-motion";
import DoctorItem from "@/components/common/DoctorItem";
import ReviewDoctor from "@/components/common/reviews/ReviewDoctor";
import { useDisPlay } from "@/hooks";

export default function HealthFacilityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // get data
  const { data: data, mutate } = useSWR<ResDataPaginations<HealthFacility>>(
    `${API_HEALTH_FACILITIES}?bookingId=${params.id}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );
  const healthFacility: HealthFacility | null = useMemo(() => {
    return data?.rows?.[0] || null;
  }, [data]);
  const { scrollTo } = useDisPlay();
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const h3Ref = useRef(null);
  const h4Ref = useRef(null);
  const h5Ref = useRef(null);
  const h6Ref = useRef(null);
  console.log("healthFacility", healthFacility);
  // state
  const [currentImage, setCurrentImage] = useState<Number>(0);

  // setting
  const settings = {
    dots: true,
    infinite: true,
    // speed: 1000,
    // autoplay: true,
    // autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  let sliderRef: any = useRef(null);
  const [address, setAddress] = useState("");
  const [tp, setTp] = useState("");
  const [tpl, setTpl] = useState("");
  useEffect(() => {
    useGetAddress({
      wardCode: healthFacility?.addressCode?.[0] || "",
      districtCode: healthFacility?.addressCode?.[1] || "",
      provinceCode: healthFacility?.addressCode?.[2] || "",
    })
      .then((ob) => {
        setAddress(ob.address);
        setTp(ob.values.province);
        setTpl(ob.values.ward + ", " + ob.values.district);
      })
      .catch((e) => "");
  }, [
    healthFacility?.addressCode?.[1],
    healthFacility?.addressCode?.[2],
    healthFacility?.addressCode?.[3],
  ]);

  // doctor
  const fetcher: BareFetcher<ResDataPaginations<WorkRoomAndSchedule>> = async ([
    url,
    token,
  ]) =>
    (
      await instances.get(url, {
        params: {
          ...token,
        },
      })
    ).data;

  const {
    data: doctorWorkings,
    mutate: mutateDoctorWorkings,
    isLoading,
  } = useSWR<ResDataPaginations<WorkRoomAndSchedule>>(
    [
      `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}`,
      {
        healthFacilityId: params.id || "",
      },
    ],
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  return (
    <div className="bg-[#fafff9]">
      <div className="container mx-auto pt-12">
        {/* image */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7">
            {healthFacility?.images?.length == 1 ? (
              <Image
                src={healthFacility?.images?.[0]}
                classNames={{}}
                width={800}
                height={600}
                className="flex-1 shadow w-full h-[500px] object-cover object-bottom
              "
              ></Image>
            ) : (
              <Slider
                {...settings}
                className="w-full max-h-[600px]"
                ref={(slider) => {
                  if (slider) sliderRef = slider;
                }}
              >
                {healthFacility?.images.map((url, i) => {
                  return (
                    <div className="">
                      <Image
                        key={url}
                        src={url}
                        classNames={{}}
                        width={800}
                        height={600}
                        className="flex-1 shadow w-full h-[500px] object-cover object-bottom
                    "
                      ></Image>
                    </div>
                  );
                })}
              </Slider>
            )}
          </div>
          <div className="col-span-5 ">
            <div className="mb-6">
              <h4 className="text-[#1b3c74] text-2xl font-medium">
                {healthFacility?.name}
              </h4>
              <p className="text-base text-[rgb(60,66,83)]/90 mt-2  font-medium">
                {address || <PulseLoader color="gray" size={4} />}
              </p>
            </div>
            <div className="flex items-center gap-5 justify-left mb-6">
              {healthFacility?.images.map((url, i) => {
                return (
                  <div className="">
                    <Image
                      key={url}
                      src={url}
                      classNames={{}}
                      width={100}
                      height={100}
                      className="flex-1 w-[70px] h-[70px] object-cover object-bottom
                      "
                    ></Image>
                  </div>
                );
              })}
            </div>
            <div className="mb-6 ml-[-16px]">
              <Tabs variant="underlined" color="primary" size="md">
                <Tab
                  key="0"
                  title={
                    <div onClick={() => scrollTo(h6Ref.current, { top: 90 })}>
                      Tổng quan
                    </div>
                  }
                />
                {healthFacility?.markdownHtml && (
                  <Tab
                    key="1"
                    title={
                      <div onClick={() => scrollTo(h1Ref.current, { top: 90 })}>
                        Giới thiệu
                      </div>
                    }
                  />
                )}

                <Tab
                  key="2"
                  title={
                    <div onClick={() => scrollTo(h2Ref.current, { top: 90 })}>
                      Vị trí
                    </div>
                  }
                />
                <Tab
                  key="3"
                  title={
                    <div onClick={() => scrollTo(h3Ref.current, { top: 90 })}>
                      Danh sách bác sỉ
                    </div>
                  }
                />
                <Tab
                  key="4"
                  title={
                    <div onClick={() => scrollTo(h4Ref.current, { top: 90 })}>
                      Đánh giá
                    </div>
                  }
                />
                <Tab
                  key="5"
                  title={
                    <div onClick={() => scrollTo(h5Ref.current, { top: 90 })}>
                      Liên hệ
                    </div>
                  }
                />
              </Tabs>
            </div>

            <div className="mb-6 ">
              <h4 ref={h6Ref} className="font-bold text-[#1b3c74] text-2xl">
                Tổng quan
              </h4>
              <p className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90">
                Cơ sở y tế <span>{healthFacility?.name}</span> nằm ở {tp} với
                hơn 100 bác sỉ và 300 phòng khám bệnh.
              </p>
            </div>
            <div className="mb-6 ">
              <h4 ref={h5Ref} className="font-bold text-[#1b3c74] text-2xl">
                Liên hệ
              </h4>
              <div className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90">
                <div className="flex items-center gap-2">
                  <div className="flex items-center relative top-[1px]">
                    <HiOutlineMail size={18} />
                  </div>
                  <span>{healthFacility?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center relative top-[1px]">
                    <HiOutlinePhone size={18} />
                  </div>
                  <span>{healthFacility?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {healthFacility?.markdownHtml && (
          <>
            <div className="mt-6">
              <h4 ref={h1Ref} className="font-bold text-[#1b3c74] text-2xl">
                Giới thiệu
              </h4>

              {healthFacility?.markdownHtml && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: healthFacility?.markdownHtml,
                  }}
                  className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90"
                ></div>
              )}
            </div>
            <Divider className="my-12" />
          </>
        )}

        <div className="mt-6">
          <h4 ref={h2Ref} className="font-bold text-[#1b3c74] text-2xl">
            Vị trí
          </h4>

          <div className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90">
            Cơ sở y tế <span> {healthFacility?.name}</span> nằm ở{" "}
            <Chip color="default" size="md" radius="sm" className="mx-1">
              {tpl}
            </Chip>
            trực thuộc{" "}
            <Chip color="default" size="md" radius="sm" className="mx-1">
              {tp}
            </Chip>
            .
          </div>
          <div className="mt-0 text-base font-medium  text-[rgb(60,66,83)]/90">
            Địa chỉ cụ thể: {healthFacility?.address}
          </div>
        </div>
        <Divider className="my-12" />
        <div className="mt-6">
          <h4 ref={h3Ref} className="font-bold text-[#1b3c74] text-2xl">
            Danh sách bác sĩ
          </h4>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <AnimatePresence mode="popLayout">
              {doctorWorkings?.rows.map(
                (i: WorkRoomAndSchedule, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    key={i.id}
                    transition={{
                      delay: 0.3,
                    }}
                    exit={{ opacity: 0, x: 60 }}
                  >
                    <DoctorItem
                      key={i.id}
                      active={false}
                      // active={item?.Working.staffId === i.Working.staffId}
                      workRoomAndSchedule={i}
                      handleClickCard={() => {}}
                      index={index}
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>

        <Divider className="my-12" />
        <div className="mt-6">
          <h4 ref={h4Ref} className="font-bold text-[#1b3c74] text-2xl">
            Đánh giá gần đây
          </h4>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* <ReviewDoctor /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
