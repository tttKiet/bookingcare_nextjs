import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { PatientProfile } from "@/models";
import { Button } from "antd";
import moment from "moment";
import Link from "next/link";
import * as React from "react";
import toast from "react-hot-toast";
import { BiUserPin } from "react-icons/bi";
import { BsTelephone, BsTrash } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

export interface IPatientProfileItemProps {
  data: PatientProfile;
  onClickDelete: (id: string) => void;
}

export function PatientProfileItem({
  data,
  onClickDelete,
}: IPatientProfileItemProps) {
  const { address } = useGetAddress({
    wardCode: data.addressCode[0],
    districtCode: data.addressCode[1],
    provinceCode: data.addressCode[2],
  });

  return (
    <div className="text-base p-6 px-4 border-b border-b-gray-700/30">
      <div className="flex gap-2 border-black mb-2">
        <label className="flex items-center gap-2 text-neutral-700 ">
          <BiUserPin />
          Họ & tên:
        </label>
        <span className="text-blue-600">{data.fullName}</span>
      </div>
      <div className="flex gap-2 border-black mb-2">
        <label className="flex items-center gap-2 text-neutral-700 ">
          <HiOutlineMail />
          Email:
        </label>
        <span className="text-blue-950">{data.email}</span>
      </div>
      <div className="flex gap-2 border-black mb-2">
        <label className="flex items-center gap-2 text-neutral-700 ">
          <BsTelephone />
          Số điện thoại:
        </label>
        <span className="text-blue-950">{data.phone}</span>
      </div>
      <div className="flex gap-2 border-black mb-2">
        <label className="flex items-center gap-2 text-neutral-700 ">
          <LiaBirthdayCakeSolid />
          Ngày sinh:
        </label>
        <span className="text-blue-950">
          {moment(data.birthDay).format("L")}
        </span>
      </div>

      <div className="flex gap-2 border-black mb-2">
        <label className="flex items-center gap-2 text-neutral-700 ">
          <LiaBirthdayCakeSolid />
          Địa chỉ:
        </label>
        <span className="text-blue-950">{address || "Lỗi lấy địa chỉ"}</span>
      </div>

      <div className="flex justify-end gap-2 py-2">
        <Button
          danger
          type="dashed"
          className="flex items-center gap-2 justify-center"
          onClick={() => onClickDelete(data.id)}
        >
          <BsTrash />
          Xóa hồ sơ
        </Button>
        <Link
          className="p-1 px-[15px] text-sm text-blue-500 flex items-center  gap-2"
          href={`/user?tag=add-patient-profile&id=${data.id}`}
        >
          Sửa hồ sơ
        </Link>
        <Button type="text" onClick={() => toast("Cập nhật sau...")}>
          Chi tiết
        </Button>
      </div>
    </div>
  );
}
