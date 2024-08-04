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
import maleAvt from "../../../assets/images/doctor/male_doctor.png";
import femaleAvt from "../../../assets/images/doctor/female_doctor.png";
import { useAuth, useDisPlay } from "@/hooks";
import { Button } from "@nextui-org/button";
import { CiChat2 } from "react-icons/ci";
import { TbMessageCircle } from "react-icons/tb";
import { socketApi } from "@/api-services/socket-api";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function DoctorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { scrollTo } = useDisPlay();
  const router = useRouter();
  const profile = useAuth();
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
    [`${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}?doctorId=${params.id}`],
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
      doctorWorkingAll?.rows?.filter((d: WorkRoomAndSchedule) => {
        return d?.Working?.staffId !== params?.id;
      }) || []
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

  function handleClickChat() {
    if (!profile?.profile?.id) {
      return toast.warn("Vui lòng đăng nhập để chat.");
    }
    socketApi.joinRoom({
      staffId: params.id,
      userId: profile?.profile?.id || "",
    });
    router.push("/user?tag=chat&chatId=" + params.id);
  }

  return (
    <div>
      <div className="bg-[#fafff9] ">
        <div className="container mx-auto pt-12 pb-12">
          {/* image */}
          <div className="grid grid-cols-12 gap-16">
            <div className="col-span-7">
              <div className="mb-3 flex items-center gap-5">
                <Avatar
                  isBordered
                  size="lg"
                  color="default"
                  src={
                    doctorData?.Working.Staff?.gender == "male"
                      ? maleAvt.src
                      : femaleAvt.src
                  }
                />
                <div>
                  <h4 className="text-[#1b3c74] text-xl font-medium  flex items-center gap-2">
                    {doctorData?.Working.Staff?.fullName?.toUpperCase()}
                    <svg
                      className="my-auto ml-0 h-5 fill-blue-400"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      version="1.1"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                    </svg>
                  </h4>
                  <p className="text-base text-[rgb(60,66,83)]/90  font-medium">
                    {doctorData?.Working.Staff?.Specialist?.name}{" "}
                  </p>
                </div>
              </div>

              <div className="mb-6 flex items-start justify-between gap-3 ">
                <div>
                  <p className="text-base text-[rgb(60,66,83)]/90  ">
                    {doctorData?.Working?.Staff?.AcademicDegree?.name}
                  </p>
                  <p className="text-base text-[rgb(60,66,83)]/90  ">
                    {doctorData?.Working?.Staff.experience}
                  </p>
                </div>

                <div
                  className="relative flex-shrink-0 hover:opacity-80 cursor-pointer"
                  onClick={handleClickChat}
                >
                  <div className="flex items-center gap-1 font-medium ">
                    Chat
                    <TbMessageCircle size={26} />
                  </div>
                  <div
                    className="absolute -right-2 bottom-5 h-4 w-4 z-10 sm:top-1 rounded-full
                          border-4 border-white bg-green-400 sm:invisible md:visible"
                    title="User is online"
                  ></div>
                </div>
              </div>

              <div className="mb-12 ml-[-16px]">
                <TabsReact variant="underlined" color="primary" size="md">
                  <TabReact
                    key="1"
                    title={
                      <div
                        onClick={() => {
                          scrollTo(h1Ref.current, { top: 190 });
                        }}
                      >
                        Lịch khám
                      </div>
                    }
                  />
                  <TabReact
                    key="2"
                    title={
                      <div
                        onClick={() => scrollTo(h2Ref.current, { top: 190 })}
                      >
                        Liên hệ
                      </div>
                    }
                  />
                  <TabReact
                    key="3"
                    title={
                      <div
                        onClick={() => scrollTo(h4Ref.current, { top: 190 })}
                      >
                        Bác sĩ
                      </div>
                    }
                  />
                  <TabReact
                    key="4"
                    title={
                      <div
                        onClick={() => scrollTo(h3Ref.current, { top: 190 })}
                      >
                        Đánh giá
                      </div>
                    }
                  />
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
                                {moment(sfd.date).format("dddd, Do/Mo")}
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
                <Link
                  href={`/booking?healthFacilityId=${doctorData?.Working?.healthFacilityId}&doctorId=${params.id}`}
                >
                  <Button color="primary" size="md" variant="bordered">
                    Đặt lịch ngay
                  </Button>
                </Link>
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
                    className="justify-between before:bg-white/20
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
                <div className="bg-[#fff] shadow rounded-lg pb-4">
                  <h4 className="text-center pt-4 mb-4 text-[#1b3c74] font-medium text-base">
                    Các bệnh nhân gần đây
                  </h4>
                  <div
                    className="flex items-start 
                justify-center flex-col max-h-96 overflow-y-scroll pr-4 "
                  >
                    {lassCheckUp?.rows.map((h: HealthRecord) => (
                      <div className="px-8 py-4 w-full">
                        <div className="border-none w-full">
                          <div className="flex items-center gap-3">
                            <Avatar
                              radius="full"
                              size="md"
                              name={h?.Patient?.fullName}
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
                                  variant="flat"
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
                  {lassCheckUp?.rows.length == 0 && (
                    <div className="py-6 pt-0 text-center flex-1 w-full">
                      Chưa có bệnh nhân khám!
                    </div>
                  )}
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
                <h4 className="font-bold text-[#1b3c74] text-2xl" ref={h4Ref}>
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
          <h4
            className="font-bold text-[#000] text-2xl"
            id="review"
            ref={h3Ref}
          >
            Đánh giá
          </h4>

          <div className=" mt-4 mb-20">
            <ReviewDoctor staffId={params.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
