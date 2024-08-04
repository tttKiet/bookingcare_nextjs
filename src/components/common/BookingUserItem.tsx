"use client";

import { useGetAddress } from "@/hooks/use-get-address-from-code";
import {
  BookingForUser,
  PatientProfile,
  ResBookingAndHealthRecord,
} from "@/models";
import {
  AccordionItem,
  Avatar,
  Button,
  Chip,
  Divider,
  User,
} from "@nextui-org/react";
import moment from "moment";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BiUserPin } from "react-icons/bi";
import { BsTelephone, BsTrash } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { IoLocationOutline } from "react-icons/io5";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { FadeLoader, PulseLoader } from "react-spinners";
import { ActionGroup, ActionBox } from "../box";
import { FaPhoneVolume } from "react-icons/fa6";
import { MethodPayment } from "./step-boking/PaymentInformation";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import { API_DOCTOR_BOOKING } from "@/api-services/constant-api";

export interface IBookingUserItemProps {
  data: BookingForUser;
  onClickDelete: (id: string) => void;
}

export function BookingUserItem({
  data,
  onClickDelete,
}: IBookingUserItemProps) {
  const { data: dataHealthRecord } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${data?.id}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  const [colorSelected, setColorSelected] = useState<
    "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  >(() => {
    if (data.status == "CU2") {
      return "primary";
    } else if (data.status == "CU3") {
      return "warning";
    } else if (data.status == "CU4") {
      return "danger";
    } else {
      return "default";
    }
  });

  return (
    <div className="flex items-start justify-around gap-8">
      <div className="flex justify-between items-start gap-8">
        <div className="grid grid-cols-1 gap-2 flex-1">
          <div className="flex gap-2  items-center text-blue-950 border-black mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <span className=""> {data?.PatientProfile?.email}</span>
          </div>

          <div className="flex gap-2  items-center border-black mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <span className="font-medium"> {data?.PatientProfile?.phone}</span>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <Link
              href={`/user/booking/${data?.id}`}
              className="text-blue-400 underline underline-offset-1"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
        <Divider orientation="vertical" className="h-[200px]" />
      </div>
      <div className="flex-1">
        <div>
          <div className="flex items-center justify-between gap-2">
            <User
              className="text-base"
              avatarProps={{ radius: "lg" }}
              description={`Doctor | ${data.HealthExaminationSchedule.Working.Staff.Specialist.name}`}
              name={data.HealthExaminationSchedule.Working.Staff.fullName}
            >
              {data.HealthExaminationSchedule.Working.Staff.fullName}
            </User>
            {data.status == "CU2" &&
              dataHealthRecord?.rows?.[0].statusCode == "HR4" && (
                <Button color="primary">Đánh giá</Button>
              )}
          </div>

          <div className="my-6">
            <h5 className="my-2 text-sm font-bold">Thông tin đặt khám</h5>
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Mã đặt khám</div>
              <div className="text-black font-medium">{data.id}</div>
            </div>
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Ngày khám</div>
              <div className="text-black font-medium">
                <Chip color="secondary" variant="flat">
                  {data.HealthExaminationSchedule.TimeCode.value},{" "}
                  {moment(data.HealthExaminationSchedule.date).format("L")}
                </Chip>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Nơi khám bệnh</div>
              <div className="text-black font-medium">
                Phòng {data.workRoom.ClinicRoomRoomNumber},{" "}
                {data.workRoom.ClinicRoom.HealthFacility.name}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Địa chỉ</div>
              <div className="text-black font-medium">
                {data.workRoom.ClinicRoom.HealthFacility.address}
              </div>
            </div>
          </div>
          <div className="my-6">
            <h5 className="my-2 text-sm font-bold">Thông tin thanh toán</h5>

            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Phương thức thanh toán</div>
              <div className="text-black font-bold ">
                {MethodPayment[data.paymentType]}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Số tiền</div>
              <div className="text-black font-medium">
                {data.doctorPrice.toLocaleString()} vnđ
              </div>
            </div>
          </div>
          <Divider />
          <div className="my-6">
            <div className="flex items-center justify-between gap-2 my-4">
              <div className="text-[#000]/70">Trạng thái</div>
              <div className="text-black font-bold ">
                <Chip color={colorSelected} variant="flat">
                  {data.Code.value}
                </Chip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="float-right mb-4 mt-3">
        <ActionGroup className="justify-start">
          <ActionBox
            type="edit"
            onClick={() => {}}
            href={`/user?tag=add-patient-profile&id=${data.id}`}
          />
          <ActionBox type="delete" onClick={() => onClickDelete(data.id)} />
        </ActionGroup>
      </div> */}
    </div>
  );
}
