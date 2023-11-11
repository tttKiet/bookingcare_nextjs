"use client";

import * as React from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, List } from "antd";
import { SearchProps } from "antd/es/input";
import { CiSearch } from "react-icons/ci";
import { ResDataPaginations } from "@/types";
import { HealthExaminationSchedule, Staff, WorkRoom, Working } from "@/models";
import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_WORK_ROOM,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import useSWR from "swr";
import { ScheduleBox } from "../schudule.box";
import { useRouter } from "next/navigation";
import DoctorItem from "./DoctorItem";
export interface IChooseDoctorProps {
  healthFacilityId: string;
  next: (step: number, value: any) => void;
}

export interface WorkRoomAndSchedule extends WorkRoom {
  schedules: string[];
}
const ChooseDoctor = React.forwardRef(
  (
    { healthFacilityId, next }: IChooseDoctorProps,
    ref: React.LegacyRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const refDoctor = React.useRef(null);
    const { data: doctorWorkings } = useSWR<
      ResDataPaginations<WorkRoomAndSchedule>
    >(
      `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}?healthFacilityId=${
        healthFacilityId || ""
      }`
    );

    const [item, setItem] = React.useState<WorkRoom | null>(null);

    function handleClickCard(item: WorkRoomAndSchedule) {
      setItem(item);
    }

    function handleClickContinue() {
      next(1, item);
    }

    return (
      <div
        ref={ref}
        className="min-h-[400px] flex flex-col gap-1 justify-between"
      >
        <div>
          <Input
            placeholder="Tìm kiếm bác sỉ"
            size="large"
            suffix={
              <CiSearch
                style={{
                  fontSize: 16,
                  color: "#1677ff",
                }}
              />
            }
          />

          <List
            itemLayout="horizontal"
            dataSource={doctorWorkings?.rows || []}
            renderItem={(i: WorkRoomAndSchedule, index) => (
              <DoctorItem
                active={item?.Working.staffId === i.Working.staffId}
                workRoomAndSchedule={i}
                handleClickCard={handleClickCard}
                index={index}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-4 py-5">
          <Button type="dashed" onClick={() => router.back()}>
            Trở lại
          </Button>
          <Button
            type={item ? "primary" : "dashed"}
            onClick={handleClickContinue}
            disabled={!item}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }
);

export { ChooseDoctor };
