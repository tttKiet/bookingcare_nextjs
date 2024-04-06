"use client";
import { API_DOCTOR_SCHEDULE_HEALTH_EXAM } from "@/api-services/constant-api";
import {
  HealthExaminationSchedule,
  ScheduleAvailable,
  ScheduleFilterDoctor,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { sortTimeSlots } from "@/untils/common";
import { Button, Checkbox, RadioGroup } from "@nextui-org/react";
import { Tabs, TabsProps } from "antd";
import { Variants } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { CiSun, CiCloudSun } from "react-icons/ci";
import useSWR from "swr";

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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h2 className="mb-6 mt-4 font-bold text-base text-center flex items-center justify-center gap-2">
                        <div>
                          <CiSun size={24} color="#FFD700" />
                        </div>{" "}
                        Sáng
                      </h2>
                      <ul className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                        {sortTimeSlots(
                          sfd?.data?.[0]?.schedules || []
                        ).Morning.map((sch, index) => (
                          <Button
                            isDisabled={!sch.isAvailableBooking}
                            color={
                              healthExaminationSchedule?.timeCode ==
                              sch.timeCode
                                ? "primary"
                                : "default"
                            }
                            variant="bordered"
                            size="sm"
                            onClick={() => {
                              setHealthExaminationSchedule((h) =>
                                h?.timeCode !== sch.timeCode ? sch : null
                              );
                            }}
                            className="text-left"
                          >
                            <Checkbox
                              size="sm"
                              isSelected={
                                healthExaminationSchedule?.timeCode ==
                                sch.timeCode
                              }
                              onChange={(e) => {
                                setHealthExaminationSchedule(() =>
                                  e.target.checked ? sch : null
                                );
                              }}
                              className="text-left"
                            >
                              <div className="w-full flex justify-between gap-2 font-bold text-md">
                                {sch.TimeCode.value}
                              </div>
                            </Checkbox>
                          </Button>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h2 className="mb-6 mt-4 font-bold text-base text-center flex items-center justify-center gap-2">
                        <div>
                          <CiCloudSun size={24} color="#6495ED" />
                        </div>{" "}
                        Chiều
                      </h2>
                      <ul className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                        {sortTimeSlots(
                          sfd?.data?.[0]?.schedules || []
                        ).Afternoon.map((sch, index) => (
                          <Button
                            color={
                              healthExaminationSchedule?.timeCode ==
                              sch.timeCode
                                ? "primary"
                                : "default"
                            }
                            variant="bordered"
                            isDisabled={!sch.isAvailableBooking}
                            size="sm"
                            onClick={() => {
                              setHealthExaminationSchedule((h) =>
                                h?.timeCode !== sch.timeCode ? sch : null
                              );
                            }}
                          >
                            <Checkbox
                              size="sm"
                              isSelected={
                                healthExaminationSchedule?.timeCode ==
                                sch.timeCode
                              }
                              onChange={(e) => {
                                setHealthExaminationSchedule(() =>
                                  e.target.checked ? sch : null
                                );
                              }}
                            >
                              <div className="w-full flex justify-between gap-2 font-bold">
                                {sch.TimeCode.value}
                              </div>
                            </Checkbox>
                          </Button>
                        ))}
                      </ul>
                    </div>

                    {/* {sfd.data?.[0].schedules.map((sch) => (
                      <Button
                        color={
                          selectedTimeCode == sch.timeCode
                            ? "primary"
                            : "default"
                        }
                        variant="bordered"
                        size="sm"
                      >
                        <Checkbox
                          size="sm"
                          isSelected={
                            healthExaminationSchedule?.timeCode == sch.timeCode
                          }
                          onChange={(e) => {
                            setHealthExaminationSchedule(() =>
                              e.target.checked ? sch : null
                            );
                          }}
                        >
                          <div className="w-full flex justify-between gap-2 font-bold">
                            {sch.TimeCode.value}
                          </div>
                        </Checkbox>
                      </Button>
                    ))} */}
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
