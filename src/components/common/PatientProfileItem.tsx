"use client";

import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { PatientProfile } from "@/models";
import { AccordionItem, Avatar } from "@nextui-org/react";
import { Button } from "antd";
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

export interface IPatientProfileItemProps {
  data: PatientProfile;
  onClickDelete: (id: string) => void;
}

export function PatientProfileItem({
  data,
  onClickDelete,
}: IPatientProfileItemProps) {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    useGetAddress({
      wardCode: data.addressCode[0],
      districtCode: data.addressCode[1],
      provinceCode: data.addressCode[2],
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [data.addressCode[0], data.addressCode[1], data.addressCode[2]]);

  return (
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
        <div className="flex gap-2 item-start border-black mb-2">
          <div className="min-w-[80px] ">
            <label className="flex gap-2 items-center  text-neutral-700 ">
              <span className="flex-shrink-0">
                <BiUserPin />
              </span>
              Họ & tên:
            </label>
          </div>
          <span className="text-blue-600">{data.fullName}</span>
        </div>

        <div className="flex gap-2  item-start border-black mb-2">
          <div className="min-w-[80px] ">
            <label className="flex items-center gap-2 text-neutral-700 ">
              <HiOutlineMail />
              Email:
            </label>
          </div>
          <span className="text-blue-950">{data.email}</span>
        </div>

        <div className="flex gap-2  item-start border-black mb-2">
          <div className="min-w-[80px] ">
            <label className="flex items-center gap-2 text-neutral-700 ">
              <BsTelephone />
              Số điện thoại:
            </label>
          </div>
          <span className="text-blue-950">{data.phone}</span>
        </div>

        <div className="flex gap-2 item-start border-black mb-2">
          <div className="min-w-[80px] ">
            <label className="flex items-center  gap-2 text-neutral-700 m">
              <LiaBirthdayCakeSolid />
              Ngày sinh:
            </label>
          </div>

          <span className="text-blue-950">
            {moment(data.birthDay).format("L")}
          </span>
        </div>

        <div className="flex gap-2 col-span-2 item-start border-black mb-2">
          <div className="min-w-[80px] ">
            <label className="flex items-center gap-2 text-neutral-700  ">
              <span className="flex-shrink-0">
                <IoLocationOutline />
              </span>
              Địa chỉ:
            </label>
          </div>

          <span className="text-blue-950">
            {address || <PulseLoader color="gray" size={4} />}
          </span>
        </div>
      </div>

      <div className="float-right mb-4 mt-3">
        <ActionGroup className="justify-start">
          <ActionBox
            type="edit"
            onClick={() => {}}
            href={`/user?tag=add-patient-profile&id=${data.id}`}
          />
          <ActionBox type="delete" onClick={() => onClickDelete(data.id)} />
        </ActionGroup>
      </div>
    </div>
  );
}
