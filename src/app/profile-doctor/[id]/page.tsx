"use client";

import {
  API_DOCTOR_LAST_CHECK_UP,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import instances from "@/axios";
import DoctorItem from "@/components/common/DoctorItem";
import { WorkRoomAndSchedule } from "@/components/common/step-boking";
import { HealthRecord, ScheduleFilterDoctor } from "@/models";
import { ResDataPaginations } from "@/types";
import { sortTimeSlots } from "@/untils/common";
import {
  Avatar,
  Button,
  Card,
  CardFooter,
  Chip,
  Divider,
  Image,
  Select,
  Tab,
} from "@nextui-org/react";
import { Tabs } from "antd";
import { Tabs as TabsReact, Tab as TabReact } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { GiVerticalFlip } from "react-icons/gi";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { PiSealCheckDuotone, PiSealCheckThin } from "react-icons/pi";
import useSWR, { BareFetcher } from "swr";
import ReviewDoctor from "@/components/common/reviews/ReviewDoctor";
import { useDisPlay } from "@/hooks";

export default function DoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { scrollTo } = useDisPlay();
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const h3Ref = useRef(null);
  const h4Ref = useRef(null);
  const h5Ref = useRef(null);
  const h6Ref = useRef(null);
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
  const doctorData: WorkRoomAndSchedule | null = useMemo(() => {
    return doctorWorkings?.rows?.[0] || null;
  }, [doctorWorkings]);

  // More
  const { data: doctorWorkingAll, mutate: mutateDoctorWorkingAll } = useSWR<
    ResDataPaginations<WorkRoomAndSchedule>
  >(
    [
      `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}`,
      {
        healthFacilityId: doctorData?.Working.healthFacilityId || "",
      },
    ],
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const doctorDataMorePaginations: WorkRoomAndSchedule[] = useMemo(() => {
    return (
      doctorWorkingAll?.rows?.filter(
        (d: WorkRoomAndSchedule) => d?.Working?.staffId !== params?.id
      ) || []
    );
  }, [doctorWorkingAll]);

  const { data: schedulesFilterDoctor } = useSWR<
    ResDataPaginations<ScheduleFilterDoctor>
  >(`${API_DOCTOR_SCHEDULE_HEALTH_EXAM}?staffId=${params.id}`, {
    dedupingInterval: 3000,
  });

  const { data: lassCheckUp } = useSWR<ResDataPaginations<HealthRecord>>(
    `${API_DOCTOR_LAST_CHECK_UP}?staffId=${params.id}`,
    {
      dedupingInterval: 3000,
    }
  );

  return (
    <div>
      <div className="bg-[#fafff9] ">
        <div className="container mx-auto pt-12 pb-12">
          {/* image */}
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-7">
              <div className="mb-3 flex items-center gap-5">
                <Avatar
                  isBordered
                  size="lg"
                  color="default"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
                <div>
                  <h4 className="text-[#1b3c74] text-xl font-medium  flex items-center gap-2">
                    {doctorData?.Working.Staff?.fullName?.toUpperCase()}
                    <PiSealCheckDuotone color="blue" />
                  </h4>
                  <p className="text-base text-[rgb(60,66,83)]/90  font-medium">
                    {doctorData?.Working.Staff?.Specialist?.name}{" "}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-base text-[rgb(60,66,83)]/90  ">
                  {doctorData?.Working?.Staff?.AcademicDegree?.name}
                </p>
                <p className="text-base text-[rgb(60,66,83)]/90  ">
                  {doctorData?.Working?.Staff.experience}
                </p>
              </div>

              <div className="mb-12 ml-[-16px]">
                <TabsReact variant="underlined" color="primary" size="md">
                  <TabReact
                    key="1"
                    title={
                      <div
                        onClick={() => {
                          scrollTo(h1Ref.current, { top: 90 });
                        }}
                      >
                        Lịch khám
                      </div>
                    }
                  />
                  <TabReact
                    key="2"
                    title={
                      <div onClick={() => scrollTo(h2Ref.current, { top: 90 })}>
                        Liên hệ
                      </div>
                    }
                  />
                  <TabReact
                    key="4"
                    title={
                      <div onClick={() => scrollTo(h3Ref.current, { top: 90 })}>
                        Đánh giá
                      </div>
                    }
                  />
                  <TabReact key="3" title="Bác sỉ" />
                </TabsReact>
              </div>
              <div className=" mb-6 ">
                <h4
                  id="h1"
                  ref={h1Ref}
                  className="font-bold text-[#1b3c74] text-2xl"
                >
                  Lịch khám sắp tới
                </h4>

                {schedulesFilterDoctor?.rows.length > 0 ? (
                  <>
                    <Tabs
                      items={schedulesFilterDoctor?.rows.map(
                        (sfd: ScheduleFilterDoctor) => ({
                          label: (
                            <div className="flex items-center justify-center gap-2 flex-col mb-1">
                              <span className="font-bold text-sm">
                                {moment(sfd.date).format("dddd, DD/do")}
                              </span>
                              <span className="text-sm text-green-500">
                                +{sfd.data?.[0].schedules.length} khung giờ
                              </span>
                            </div>
                          ),
                          key: sfd.date,
                          disabled: false,
                          children: (
                            <div className="text-left">
                              <div className=" mt-8">
                                {sortTimeSlots(sfd?.data?.[0]?.schedules || [])
                                  .Morning.length > 0 && (
                                  <div className="flex items-start gap-2 ">
                                    <div className="flex-shrink-0 whitespace-nowrap text-right">
                                      <h2
                                        className="
                            gap-2  font-medium text-base text-right"
                                      >
                                        Buổi sáng:
                                      </h2>
                                    </div>

                                    <ul className="flex items-center flex-wrap gap-2 ">
                                      {sortTimeSlots(
                                        sfd?.data?.[0]?.schedules || []
                                      ).Morning.map((sch, index) => (
                                        <motion.div
                                          initial={{ opacity: 0, x: 20 }}
                                          whileInView={{ opacity: 1, x: 0 }}
                                          viewport={{ once: true }}
                                          key={sch.id}
                                          transition={{
                                            delay: 0.2,
                                          }}
                                          exit={{ opacity: 0, x: 20 }}
                                        >
                                          <Chip
                                            size="md"
                                            color="primary"
                                            radius="sm"
                                            isDisabled={!sch.isAvailableBooking}
                                            variant={"solid"}
                                            className={`cursor-pointer hover:opacity-90 
                                  hover:bg-primary-200 transition-all 
                                       
                                    `}
                                          >
                                            {sch.TimeCode.value}
                                          </Chip>
                                        </motion.div>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {sortTimeSlots(sfd?.data?.[0]?.schedules || [])
                                  .Afternoon.length > 0 && (
                                  <div className="flex items-start gap-2 mt-8">
                                    <div className="flex-shrink-0 whitespace-nowrap text-right">
                                      <h2
                                        className="
  gap-2  font-medium text-base text-right"
                                      >
                                        Buổi Chiều:
                                      </h2>
                                    </div>

                                    <ul className="flex items-center flex-wrap gap-2 ">
                                      {sortTimeSlots(
                                        sfd?.data?.[0]?.schedules || []
                                      ).Afternoon.map((sch, index) => (
                                        <motion.div
                                          initial={{ opacity: 0, x: 20 }}
                                          whileInView={{ opacity: 1, x: 0 }}
                                          viewport={{ once: true }}
                                          key={sch.id}
                                          transition={{
                                            delay: 0.3,
                                          }}
                                          exit={{ opacity: 0, x: 20 }}
                                        >
                                          <Chip
                                            isDisabled={!sch.isAvailableBooking}
                                            size="md"
                                            color="primary"
                                            radius="sm"
                                            variant="solid"
                                            className={`cursor-pointer hover:opacity-90 
    hover:bg-primary-200 transition-all 
         
      `}
                                          >
                                            {sch.TimeCode.value}
                                          </Chip>
                                        </motion.div>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        })
                      )}
                    ></Tabs>
                  </>
                ) : (
                  <div> </div>
                )}
              </div>
              <div className="mt-8">
                <Button color="primary" size="md" variant="bordered">
                  Đặt lịch ngay
                </Button>
              </div>
              <Divider className="my-12" />

              <div className="mb-6 ">
                <h4
                  id="h2"
                  ref={h2Ref}
                  className="font-bold text-[#1b3c74] text-2xl"
                >
                  Liên hệ
                </h4>
                <div className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center relative top-[1px]">
                      <HiOutlineMail size={18} />
                    </div>
                    <span>{doctorData?.Working.Staff?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center relative top-[1px]">
                      <HiOutlinePhone size={18} />
                    </div>
                    <span>{doctorData?.Working.Staff?.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-5 ">
              <div>
                <Card isFooterBlurred radius="lg" className="border-none">
                  <Image
                    alt="Woman listing to music"
                    className="object-cover w-full"
                    height={400}
                    src={doctorData?.ClinicRoom?.HealthFacility?.images?.[0]}
                    width={500}
                  />
                  <CardFooter
                    className="justify-between before:bg-white/10
                   border-white/20 border-1 overflow-hidden py-1 
                   absolute before:rounded-xl rounded-large bottom-1
                    w-[calc(100%_-_8px)] shadow-small ml-1 z-10"
                  >
                    <p className="text-tiny text-white/80 font-medium">
                      {doctorData?.ClinicRoom?.HealthFacility?.name}
                      <p>
                        {" "}
                        Công tác tại bệnh viện vào ngày{" "}
                        {moment(doctorData?.Working?.createdAt).format("L")}
                      </p>
                    </p>
                    <Link
                      href={
                        "/health-facility/" +
                        doctorData?.ClinicRoom?.HealthFacility?.id
                      }
                    >
                      <Button
                        className="text-tiny text-white bg-black/20"
                        variant="flat"
                        color="default"
                        radius="lg"
                        size="sm"
                      >
                        Xem cơ sở
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
                {/* <div className="flex items-center gap-2 justify-center my-4 text-base font-medium  text-[rgb(60,66,83)]/90">
                  {" "}
                  Công tác tại bệnh viện vào ngày{" "}
                  {moment(doctorData?.Working?.createdAt).format("L")}
                </div> */}
              </div>
              {/* //Các bệnh nhân gần đây */}
              <div className="mt-6 ">
                <div className="bg-[#fff] shadow rounded-lg ">
                  <h4 className="text-center pt-4 mb-2 text-[#1b3c74] font-medium text-base">
                    Các bệnh nhân gần đây
                  </h4>
                  <div
                    className="flex items-start 
                justify-center flex-col max-h-96 overflow-y-scroll pr-4"
                  >
                    {lassCheckUp?.rows.map((h: HealthRecord) => (
                      <div className="px-8 py-4 w-full">
                        <div className="border-none w-full">
                          <div className="flex items-center gap-3">
                            <Avatar
                              radius="full"
                              size="md"
                              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                              className="flex-shrink-0"
                            />
                            <div className="flex flex-col items-start justify-center w-full">
                              <div
                                className="flex w-full flex-1 items-center gap-1 justify-between 
                              text-sm font-medium text-[#000]"
                              >
                                <span> {h?.Patient?.fullName}</span>
                                <Chip
                                  color="primary"
                                  size="sm"
                                  radius="sm"
                                  variant="bordered"
                                  className=""
                                >
                                  Đã khám
                                </Chip>
                              </div>
                              <div
                                className="text-sm font-medium
               text-[rgb(60,66,83)]"
                              >
                                {h?.Patient?.email}
                              </div>
                            </div>
                          </div>

                          <div className="mt-1">
                            <span>Ngày khám: </span>
                            <span>
                              {moment(
                                h?.Booking?.HealthExaminationSchedule?.date
                              ).format("L")}
                            </span>
                            <span className="px-1">|</span>
                            <span>Khung giờ: </span>
                            <span>
                              <Chip color="warning" size="sm" radius="sm">
                                {
                                  h?.Booking?.HealthExaminationSchedule
                                    ?.TimeCode?.value
                                }
                              </Chip>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {doctorData?.Working.Staff?.markdownHtml && (
            <>
              <div className="mt-6">
                <h4 className="font-bold text-[#1b3c74] text-2xl">
                  Giới thiệu
                </h4>

                <div
                  dangerouslySetInnerHTML={{
                    __html: doctorData?.Working?.Staff?.markdownHtml,
                  }}
                  className="mt-3 text-base font-medium  text-[rgb(60,66,83)]/90"
                ></div>
              </div>
            </>
          )}
          {doctorDataMorePaginations.length > 0 && (
            <>
              <Divider className="my-12" />
              <div className="mt-6">
                <h4 className="font-bold text-[#1b3c74] text-2xl">
                  Xem nhiều bác sĩ hơn
                </h4>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <AnimatePresence mode="popLayout">
                    {doctorDataMorePaginations?.map(
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
            </>
          )}
        </div>
      </div>
      <div className="border-t-1 bg-white">
        <div className="container mx-auto  pb-10 pt-6">
          <h4 className="font-bold text-[#000] text-2xl" ref={h3Ref}>
            Đánh giá
          </h4>

          <div className=" mt-4 mb-20">
            <ReviewDoctor staffId={params.id} />
          </div>
        </div>
      </div>

      <div className="min-h-screen"></div>
    </div>
  );
}
