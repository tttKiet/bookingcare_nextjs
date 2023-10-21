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
export interface IChooseDoctorProps {
  healthFacilityId: string;
  next: (step: number, value: any) => void;
}

interface WorkRoomAndSchedule extends WorkRoom {
  schedules: string[];
}
export function ChooseDoctor({ healthFacilityId, next }: IChooseDoctorProps) {
  const router = useRouter();
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
          <List.Item onClick={() => handleClickCard(i)}>
            <List.Item.Meta
              className={`border rounded-md p-3 cursor-pointer
               hover:border-blue-600 transition-all 
               duration-200 ${
                 item?.Working.staffId === i.Working.staffId &&
                 "border-blue-600"
               }`}
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={
                <div className="text-left">{i.Working.Staff.fullName}</div>
              }
              description={
                <div className="grid sm:grid-cols-2 grid-cols-1">
                  <div className="text-left">
                    {i.Working.Staff.Specialist.name} -{" "}
                    {i.Working.Staff.experience}
                    <p className="text-gray-600">
                      {i.Working.Staff.AcademicDegree.name}
                    </p>
                    <p className="text-gray-600 mt-1">
                      Giá khám:
                      <span className="rounded-xl ml-1 text-blue-500 font-medium">
                        {i.checkUpPrice.toLocaleString()} vnđ
                      </span>
                    </p>
                  </div>
                  <div className="">
                    <ScheduleBox schedules={i.schedules} />
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />

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
