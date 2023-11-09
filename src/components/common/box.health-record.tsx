import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthRecord } from "@/models";
import { Button, Divider } from "antd";
import moment from "moment";
import Link from "next/link";
import * as React from "react";
import { CgDetailsMore } from "react-icons/cg";

export interface IHealthRecordItemProps {
  healthRecord: HealthRecord | undefined;
}

export function HealthRecordItem({ healthRecord }: IHealthRecordItemProps) {
  return (
    <div className="relative p-4 pb-6 px-10 h-40 rounded-3xl overflow-hidden shadow shadow-pink-400 border-pink-400 bg-pink-300/25 ">
      <div className=" ">
        <h5 className="flex justify-between text-base mb-1  text-gray-800">
          {healthRecord?.WorkRoom?.ClinicRoom?.HealthFacility?.name}
          <Link
            title="Chi tiết"
            href={`/user/health-record/${healthRecord?.id || ""}`}
            className=" text-base text-gray-600 hover:text-black transition-all cursor-pointer p-1"
          >
            <CgDetailsMore />
          </Link>
        </h5>
        <div className="flex mb-4 justify-center">
          <span
            className={`
            border border-dashed text-xs
            rounded-md px-4 py-1
            ${
              healthRecord?.status.key == "S1"
                ? "bg-pink-100 text-pink-500 border-pink-400"
                : ""
            }
            ${
              healthRecord?.status.key == "S2"
                ? "bg-blue-100 text-blue-600 border-blue-500"
                : ""
            }
            ${
              healthRecord?.status.key == "S3"
                ? "bg-red-100 text-red-600 border-red-500"
                : ""
            }
          `}
          >
            {healthRecord?.status.value}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600 ">Ngày khám:</span>
          <span className="flex-1 text-blue-500 min-w-[200px] font-medium text-right">
            {moment(
              healthRecord?.Booking.HealthExaminationSchedule.date
            ).format("L")}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Số thứ tự:</span>
          <span className="flex-1 text-slate-950 font-semibold min-w-[200px] text-right">
            {healthRecord?.orderNumber.toString()}
          </span>
        </div>
      </div>
    </div>
  );
}
