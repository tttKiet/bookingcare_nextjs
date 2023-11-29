import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthRecord } from "@/models";
import { Button, Divider } from "antd";
import moment from "moment";
import Link from "next/link";
import * as React from "react";
import { AiOutlineFieldTime } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { FcCancel } from "react-icons/fc";

export interface IHealthRecordItemProps {
  healthRecord: HealthRecord | undefined;
}

export function HealthRecordItem({ healthRecord }: IHealthRecordItemProps) {
  console.log(healthRecord);
  return (
    <div
      className="relative p-4 pb-6 px-10 h-40 rounded-md overflow-hidden shadow 
    bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#6cff1a0f]  to-[#29292908]
    "
    >
      <div className=" ">
        <h5 className="flex justify-between text-base mb-1  text-gray-800">
          {healthRecord?.WorkRoom?.ClinicRoom?.HealthFacility?.name ? (
            healthRecord?.WorkRoom?.ClinicRoom?.HealthFacility?.name
          ) : (
            <p className="text-red-500">Lịch đã được xóa </p>
          )}
          <Link
            title="Chi tiết"
            href={`/user/health-record/${healthRecord?.id || ""}`}
            className=" text-base text-gray-600 hover:text-black transition-all cursor-pointer p-1"
          >
            <CgDetailsMore />
          </Link>
        </h5>
        <div className="flex mb-4 justify-center text-sm">
          {healthRecord?.status.key === "S1" && (
            <div className="flex items-center gap-2">
              <span
                className={`bg-gray-400 text-white px-2  rounded-md inline-flex items-center gap-1`}
              >
                <span className="mr-1"> ...</span>
                {healthRecord?.status?.value?.toLowerCase()}
              </span>
            </div>
          )}
          {healthRecord?.status.key === "S2" && (
            <span
              className={`bg-yellow-400 text-white px-2  rounded-md  inline-flex items-center gap-1`}
            >
              <AiOutlineFieldTime />
              {healthRecord?.status?.value.toLowerCase()}
            </span>
          )}
          {healthRecord?.status.key === "S3" && (
            <span
              className={`border border-dashed font-bold border-green-500 text-green-500 px-2 rounded-md  inline-flex items-center gap-1`}
            >
              <BsPatchCheckFill />
              {healthRecord?.status?.value.toLowerCase()}
            </span>
          )}
          {healthRecord?.status.key === "S4" && (
            <span
              className={`border border-dashed border-red-400  text-red-400 px-2 rounded-md  inline-flex items-center gap-1`}
            >
              <FcCancel />
              {healthRecord?.status?.value.toLowerCase()}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600 ">Ngày khám:</span>
          {healthRecord?.Booking?.HealthExaminationSchedule?.date && (
            <span className="flex-1 text-blue-500 min-w-[200px] font-medium text-right">
              {moment(
                healthRecord?.Booking?.HealthExaminationSchedule?.date
              ).format("L")}
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Số thứ tự:</span>
          <span className="flex-1 text-blue-500 font-semibold min-w-[200px] text-right">
            {healthRecord?.orderNumber.toString()}
          </span>
        </div>
      </div>
    </div>
  );
}
