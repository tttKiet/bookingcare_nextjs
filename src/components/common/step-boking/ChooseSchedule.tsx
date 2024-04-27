"use client";
import { API_DOCTOR_SCHEDULE_HEALTH_EXAM } from "@/api-services/constant-api";
import {
  HealthExaminationSchedule,
  ScheduleAvailable,
  ScheduleFilterDoctor,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { sortTimeSlots } from "@/untils/common";
import { Button, Checkbox, Chip, Divider, RadioGroup } from "@nextui-org/react";
import { Tabs, TabsProps } from "antd";
import moment from "moment";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { CiSun, CiCloudSun } from "react-icons/ci";
import useSWR from "swr";
import { AnimatePresence, motion, Variants } from "framer-motion";

export interface IChooseScheduleProps {
  staffId: string;
  next: (step: number, value: any) => void;
  previous: () => void;
}

export function ChooseSchedule({
  staffId,
  next,
  previous,
}: IChooseScheduleProps) {
  if (!staffId) {
    return "Loi";
  }
  // const tomorrow = useMemo(() => {
  //   const nextDate = new Date();
  //   nextDate.setDate(new Date().getDate() + 1);
  //   return nextDate;
  // }, []);
  // const [date, setDate] = useState(tomorrow);
  const [healthExaminationSchedule, setHealthExaminationSchedule] =
    useState<ScheduleAvailable | null>(null);
  const [selectedTimeCode, setSelectedTimeCode] = useState<
    string | undefined
  >();
  function handleSelect(date: Date) {
    // setDate(date);
    setHealthExaminationSchedule(null);
  }
  const { data: schedulesFilterDoctor } = useSWR<
    ResDataPaginations<ScheduleFilterDoctor>
  >(`${API_DOCTOR_SCHEDULE_HEALTH_EXAM}?staffId=${staffId}`, {
    dedupingInterval: 30000,
  });

  function handleClickCard(schedule: ScheduleAvailable) {
    setHealthExaminationSchedule(schedule);
  }

  function handleClickContinue() {
    next(2, healthExaminationSchedule);
  }
  console.log("schedulesFilterDoctor", schedulesFilterDoctor);

  return (
    <div className="min-h-[400px] flex flex-col gap-1 justify-between">
      {schedulesFilterDoctor?.rows.length > 0 ? (
        <Tabs
          items={schedulesFilterDoctor?.rows.map(
            (sfd: ScheduleFilterDoctor) => ({
              label: (
                <div className="flex items-center justify-center gap-2 flex-col mb-3">
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
                  {/* <h2 className="mb-6 mt-4 font-bold">Ngày và giờ khám</h2> */}
                  <div className=" mt-8">
                    <div className="flex items-start gap-2 ">
                      <div className="flex-shrink-0 whitespace-nowrap text-right">
                        <h2
                          className="
                        gap-2  font-medium text-base text-right"
                        >
                          Buổi sáng
                        </h2>
                        <span>{moment(sfd.date).format("LL")}</span>
                      </div>
                      <Divider className="h-14 mx-5" orientation="vertical" />
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
                              variant={
                                healthExaminationSchedule?.timeCode ==
                                sch.timeCode
                                  ? "solid"
                                  : "flat"
                              }
                              onClick={() => {
                                setHealthExaminationSchedule(
                                  (ch: ScheduleAvailable | null) => {
                                    if (
                                      ch &&
                                      healthExaminationSchedule?.timeCode ==
                                        sch.timeCode
                                    )
                                      return null;
                                    else return sch;
                                  }
                                );
                              }}
                              className={`cursor-pointer hover:opacity-90 
                              hover:bg-primary-200 transition-all 
                                    ${
                                      healthExaminationSchedule?.timeCode ==
                                        sch.timeCode && ""
                                    }
                                `}
                            >
                              {sch.TimeCode.value}
                            </Chip>
                          </motion.div>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-start gap-2 mt-8">
                      <div className="flex-shrink-0 whitespace-nowrap text-right">
                        <h2
                          className="
                        gap-2  font-medium text-base text-right"
                        >
                          Buổi Chiều
                        </h2>
                        <span>{moment(sfd.date).format("LL")}</span>
                      </div>
                      <Divider className="h-14 mx-5" orientation="vertical" />
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
                              variant={
                                healthExaminationSchedule?.timeCode ==
                                sch.timeCode
                                  ? "solid"
                                  : "flat"
                              }
                              onClick={() => {
                                setHealthExaminationSchedule(
                                  (ch: ScheduleAvailable | null) => {
                                    if (
                                      ch &&
                                      healthExaminationSchedule?.timeCode ==
                                        sch.timeCode
                                    )
                                      return null;
                                    else return sch;
                                  }
                                );
                              }}
                              className={`cursor-pointer hover:opacity-90 
                              hover:bg-primary-200 transition-all 
                                    ${
                                      healthExaminationSchedule?.timeCode ==
                                        sch.timeCode && ""
                                    }
                                `}
                            >
                              {sch.TimeCode.value}
                            </Chip>
                          </motion.div>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ),
            })
          )}
        ></Tabs>
      ) : (
        <div></div>
      )}

      <div className="flex justify-end gap-4 py-5">
        <Button onClick={previous} size="md">
          Trở lại
        </Button>
        <Button
          color={healthExaminationSchedule ? "primary" : "default"}
          onClick={handleClickContinue}
          disabled={!healthExaminationSchedule}
          size="md"
          className={
            healthExaminationSchedule
              ? "cursor-pointer"
              : "cursor-default select-none"
          }
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
