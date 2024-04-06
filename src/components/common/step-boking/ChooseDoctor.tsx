"use client";

import { AudioOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
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
import { LegacyRef, forwardRef, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input, ScrollShadow } from "@nextui-org/react";
import debounce from "lodash.debounce";
import { SearchIcon } from "@/components/icons/SearchIcon";
export interface IChooseDoctorProps {
  healthFacilityId: string;
  next: (step: number, value: any) => void;
}

export interface WorkRoomAndSchedule extends WorkRoom {
  schedules: string[];
}
const ChooseDoctor = forwardRef(
  (
    { healthFacilityId, next }: IChooseDoctorProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const [searchName, setSearchName] = useState<string>("");
    const refDoctor = useRef(null);
    const { data: doctorWorkings } = useSWR<
      ResDataPaginations<WorkRoomAndSchedule>
    >(
      `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}?healthFacilityId=${
        healthFacilityId || ""
      }&doctorName=${searchName}`
    );

    const [item, setItem] = useState<WorkRoom | null>(null);

    function handleClickCard(item: WorkRoomAndSchedule) {
      setItem(item);
    }

    function handleClickContinue() {
      next(1, item);
    }

    function handleSearchName(value: string) {
      setSearchName(value);
    }

    return (
      <div
        ref={ref}
        className="min-h-[400px] flex flex-col gap-1 justify-between"
      >
        <div>
          <Input
            label="Tìm kiếm nhân viên"
            radius="sm"
            isClearable={false}
            onChange={debounce(function (e) {
              handleSearchName(e.target.value);
            }, 300)}
            onClear={() => setSearchName("")}
            classNames={{
              label: "text-black/50 text-base",
              innerWrapper: "bg-transparent ",
              // base: "border border-slate-400 rounded-sm",
            }}
            className="border border-slate-400/20 rounded-md"
            placeholder="Nhập tên bác sỉ..."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />
          <ScrollShadow className="h-[400px] my-4 pr-[4px]">
            <List
              itemLayout="horizontal"
              dataSource={doctorWorkings?.rows || []}
              renderItem={(i: WorkRoomAndSchedule, index) => (
                <DoctorItem
                  key={i.id}
                  active={item?.Working.staffId === i.Working.staffId}
                  workRoomAndSchedule={i}
                  handleClickCard={handleClickCard}
                  index={index}
                />
              )}
            />
          </ScrollShadow>
        </div>

        <div className="flex justify-end gap-4 py-5">
          <Button onClick={() => router.back()} size="md">
            Trở lại
          </Button>
          <Button
            color={item ? "primary" : "default"}
            size="md"
            onClick={handleClickContinue}
            className={item ? "cursor-pointer" : "cursor-default select-none"}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }
);

export { ChooseDoctor };
