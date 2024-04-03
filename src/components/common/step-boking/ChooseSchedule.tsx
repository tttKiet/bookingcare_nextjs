"use client";
import { API_DOCTOR_SCHEDULE_HEALTH_EXAM } from "@/api-services/constant-api";
import { HealthExaminationSchedule, ScheduleFilterDoctor } from "@/models";
import { ResDataPaginations } from "@/types";
import { Button, Checkbox, RadioGroup } from "@nextui-org/react";
import { Tabs, TabsProps } from "antd";
import { Variants } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
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
    useState<HealthExaminationSchedule | null>(null);
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

  function handleClickCard(schedule: HealthExaminationSchedule) {
    setHealthExaminationSchedule(schedule);
  }

  function handleClickContinue() {
    next(2, healthExaminationSchedule);
  }

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
                    +{sfd.data.length} khung giờ
                  </span>
                </div>
              ),
              key: sfd.date,
              disabled: false,
              children: (
                <div className="text-left">
                  <h2 className="mb-6 mt-4 font-bold">Ngày và giờ khám</h2>
                  <div className="flex items-center justify-start gap-3 flex-wrap">
                    {sfd.data?.[0].schedules.map((sch) => (
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
                    ))}
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
          color={"primary"}
          onClick={handleClickContinue}
          disabled={!healthExaminationSchedule}
          size="md"
          className="cursor-pointer"
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
