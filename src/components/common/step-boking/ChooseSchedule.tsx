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
import { motion, Variants } from "framer-motion";
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
  if (!staffId) {
    return "Loi";
  }
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
  const cardVariants: Variants = {
    offscreen: {
      y: 70,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 2,
      },
    },
  };

  const scheduleVariants = {
    container: {
      initial: { opacity: 0, x: 100 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          when: "beforeChildren",
          staggerChildren: 3,
        },
      },
    },

    item: {
      initial: { opacity: 0, x: 200 },
      visible: (i: number) => ({
        opacity: 1,
        x: 0,

        transition: {
          delay: i * 0.1,
          duration: 0.2,
        },
      }), // Thay đổi giá trị delay tùy theo nhu cầu
    },
  };

  return (
    <div className="min-h-[400px] flex flex-col gap-1 justify-between">
      <div>
        <div className="flex justify-center">
          <div className="max-w-[556px] flex-1">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
            >
              <motion.div variants={cardVariants}>
                <Calendar
                  locale={locale}
                  date={date}
                  onChange={handleSelect}
                  minDate={tomorrow}
                  fixedHeight={true}
                  // className="w-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Divider />
        <div className="min-h-[68px]">
          <h4 className="text-base text-left text-gray-600 mb-3">Lịch khám</h4>
          <div>
            <motion.div
              animate="visible"
              initial="initial"
              variants={scheduleVariants.container}
              className="flex items-center gap-2 flex-wrap"
            >
              {schedules?.rows.map((row: ScheduleAvailable, index: any) => (
                <motion.div
                  animate="visible"
                  initial="initial"
                  custom={index}
                  key={row.id}
                  variants={scheduleVariants.item}
                >
                  <Button
                    className={`${
                      row.id === healthExaminationSchedule?.id
                        ? "border-blue-600  text-blue-600"
                        : ""
                    }`}
                    onClick={() => handleClickCard(row)}
                    type="dashed"
                    disabled={!row.isAvailableBooking}
                  >
                    {row.TimeCode.value}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
            {schedules?.rows.length === 0 && (
              <p className="text-red-950/70">
                Ngày {moment(date).format("L")} chưa tạo lịch khám. Vui lòng
                chọn ngày khác.
              </p>
            )}
          </div>
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
