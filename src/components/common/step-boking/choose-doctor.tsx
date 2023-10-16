import * as React from "react";
import { AudioOutlined } from "@ant-design/icons";
import { Avatar, Input, List } from "antd";
import { SearchProps } from "antd/es/input";
import { CiSearch } from "react-icons/ci";
import { ResDataPaginations } from "@/types";
import { Staff, WorkRoom, Working } from "@/models";
import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_WORK_ROOM,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import useSWR from "swr";
export interface IChooseDoctorProps {
  healthFacilityId: string | null;
}
export function ChooseDoctor({ healthFacilityId }: IChooseDoctorProps) {
  const { data: doctorWorkings } = useSWR<ResDataPaginations<WorkRoom>>(
    `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}?healthFacilityId=${
      healthFacilityId || ""
    }`
  );

  function handleClickCard(id: string) {
    console.log(id);
  }
  console.log(
    "----------------------------------------------------------------",
    doctorWorkings
  );
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
        renderItem={(item: WorkRoom, index) => (
          <List.Item onClick={() => handleClickCard(item.Working.staffId)}>
            <List.Item.Meta
              className="border rounded-md p-3 cursor-pointer hover:border-blue-600 transition-all duration-200"
              avatar={
                <Avatar
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                />
              }
              title={
                <div className="text-left">{item.Working.Staff.fullName}</div>
              }
              description={
                <div className="grid sm:grid-cols-2 grid-cols-1">
                  <div className="text-left">
                    {item.Working.Staff.Specialist.name} -{" "}
                    {item.Working.Staff.experience}
                    <p className="text-gray-600">
                      {item.Working.Staff.AcademicDegree.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-white px-6 py-2 rounded-lg bg-blue-600 ">
                      Thứ 2 - thứ 6
                    </span>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
