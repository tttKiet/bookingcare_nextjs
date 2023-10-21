"use client";
import locale from "date-fns/locale/vi";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import * as React from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Input, List } from "antd";
import { SearchProps } from "antd/es/input";
import { CiSearch } from "react-icons/ci";
import { ResDataPaginations } from "@/types";
import { HealthExaminationSchedule, Staff, WorkRoom, Working } from "@/models";
import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
  API_WORK_ROOM,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import useSWR from "swr";
import { ScheduleBox } from "../schudule.box";
import { useRouter } from "next/navigation";
import { Calendar } from "react-date-range";

import moment from "moment";
export interface IChooseScheduleProps {
  staffId: string;
  next: (step: number, value: any) => void;
  previous: () => void;
}

interface ScheduleAvailable extends HealthExaminationSchedule {
  isAvailableBooking: boolean;
}

export function ChooseSchedule({
  staffId,
  next,
  previous,
}: IChooseScheduleProps) {
  const tomorrow = React.useMemo(() => {
    const nextDate = new Date();
    nextDate.setDate(new Date().getDate() + 1);
    return nextDate;
  }, []);

  const [date, setDate] = React.useState(tomorrow);
  const [healthExaminationSchedule, setHealthExaminationSchedule] =
    React.useState<HealthExaminationSchedule | null>(null);

  function handleSelect(date: Date) {
    setDate(date);
    setHealthExaminationSchedule(null);
  }
  const { data: schedules } = useSWR<ResDataPaginations<ScheduleAvailable>>(
    `${API_DOCTOR_SCHEDULE_HEALTH_EXAM}?staffId=${staffId}&date=${date}`,
    {
      dedupingInterval: 30000,
    }
  );

  function handleClickCard(schedule: HealthExaminationSchedule) {
    setHealthExaminationSchedule(schedule);
  }

  function handleClickContinue() {
    next(2, healthExaminationSchedule);
  }

  return (
    <div>
      <div className="flex justify-center">
        <div className="max-w-[556px] flex-1">
          <Calendar
            locale={locale}
            date={date}
            onChange={handleSelect}
            minDate={tomorrow}
            fixedHeight={true}
            // className="w-full"
          />
        </div>
      </div>
      <Divider />
      <div>
        <h4 className="text-base text-left text-gray-600 mb-3">Lịch khám</h4>
        <div className="flex items-center gap-2 ">
          {schedules?.rows.map((row: ScheduleAvailable) => (
            <Button
              className={`${
                row.id === healthExaminationSchedule?.id
                  ? "border-blue-600  text-blue-600"
                  : ""
              }`}
              onClick={() => handleClickCard(row)}
              type="dashed"
              disabled={!row.isAvailableBooking}
              key={row.TimeCode.key}
            >
              {row.TimeCode.value}
            </Button>
          ))}
          {schedules?.rows.length === 0 && (
            <p className="text-red-950/70">
              Ngày {moment(date).format("L")} chưa tạo lịch khám. Vui lòng chọn
              ngày khác.
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 py-5">
        <Button type="dashed" onClick={previous}>
          Trở lại
        </Button>
        <Button
          type={date && healthExaminationSchedule ? "primary" : "dashed"}
          onClick={handleClickContinue}
          disabled={!(date && healthExaminationSchedule)}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
