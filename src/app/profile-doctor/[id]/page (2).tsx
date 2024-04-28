"use client";

import {
  API_ACCOUNT_STAFF,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_HEALTH_FACILITIES,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import instances from "@/axios";
import { WorkRoomAndSchedule } from "@/components/common/step-boking";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthFacility, ScheduleFilterDoctor, Staff } from "@/models";
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
import axios from "axios";

export default function DoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
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
        staffId: params.id || "",
      },
    ],
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const doctorData: Staff | null = useMemo(() => {
    return doctorWorkings?.rows?.[0] || null;
  }, [doctorWorkings]);
  console.log("doctorData", doctorData);

  return (
    <div className="bg-[#fafff9]">
      <div className="container mx-auto pt-12">
        {/* image */}
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-7"></div>
          <div className="col-span-5 ">
            <div className="mb-6">
              <h4 className="text-[#1b3c74] text-2xl font-medium">
                {doctorData?.fullName}
              </h4>
              <p className="text-base text-[rgb(60,66,83)]/90 mt-2  font-medium">
                {doctorData?.address || <PulseLoader color="gray" size={4} />}
              </p>
            </div>
            <div className="flex items-center gap-5 justify-left mb-6"></div>
            <div className="mb-6 ml-[-16px]">
              <Tabs variant="underlined" color="primary" size="md">
                <Tab key="0" title="Tổng quan" />
                <Tab key="1" title="Giới thiệu" />
                <Tab key="2" title="Vị trí" />
                <Tab key="3" title="Bác sỉ" />
                <Tab key="4" title="Đánh giá" />
                <Tab key="5" title="Liên hệ" />
              </Tabs>
            </div>

            <div className="mb-6 ">
              <h4 className="font-bold text-[#1b3c74] text-2xl">Tổng quan</h4>
            </div>
            <div className="mb-6 ">
              <h4 className="font-bold text-[#1b3c74] text-2xl">Liên hệ</h4>
              <div className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90">
                <div className="flex items-center gap-2">
                  <div className="flex items-center relative top-[1px]">
                    <HiOutlineMail size={18} />
                  </div>
                  <span>{doctorData?.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center relative top-[1px]">
                    <HiOutlinePhone size={18} />
                  </div>
                  <span>{doctorData?.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-bold text-[#1b3c74] text-2xl">Giới thiệu</h4>

          {doctorData?.markdownHtml && (
            <div
              dangerouslySetInnerHTML={{
                __html: doctorData?.markdownHtml,
              }}
              className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90"
            ></div>
          )}
        </div>
        <Divider className="my-12" />
        <div className="mt-6">
          <h4 className="font-bold text-[#1b3c74] text-2xl">Vị trí</h4>
        </div>
        <Divider className="my-12" />
        <div className="mt-6">
          <h4 className="font-bold text-[#1b3c74] text-2xl">
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
          <h4 className="font-bold text-[#1b3c74] text-2xl">
            Đánh giá gần đây
          </h4>

          <div className="grid grid-cols-2 gap-4 mt-4"></div>
        </div>
        <div className="min-h-screen"></div>
      </div>
    </div>
  );
}
