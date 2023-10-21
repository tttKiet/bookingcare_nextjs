"use client";

import { API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfile } from "@/models";
import { ResDataPaginations } from "@/types";
import { Button, Card, Divider, Input } from "antd";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import * as React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import useSWR from "swr";
const { TextArea } = Input;
export interface ChooseScheduleProps {
  next: (step: number, value: any) => void;
  previous: () => void;
}

export function ChoosePatientProfile({ next, previous }: ChooseScheduleProps) {
  const { profile } = useAuth();
  const [descStatusPatient, setDescStatusPatient] = React.useState<string>("");
  const [patientProfile, setPatientProfile] =
    React.useState<PatientProfile | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams.toString()}`;
  const { data: responsePatientProfile, mutate: mutatePatientProfile } = useSWR<
    ResDataPaginations<PatientProfile>
  >(`${API_PATIENT_PROFILE}?userId=${profile?.id || ""}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  function handleClickCard(p: PatientProfile) {
    setPatientProfile(p);
  }

  function handleClickContinue() {
    next(3, {
      ...patientProfile,
      descStatusPatient,
    });
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-6">
        {responsePatientProfile?.rows.map((profile: PatientProfile) => (
          <Card
            onClick={() => handleClickCard(profile)}
            key={profile.id}
            title={<h5 className="text-blue-500">{profile.fullName}</h5>}
            className={`${
              profile.id === patientProfile?.id
                ? " border-blue-500"
                : "border-transparent"
            } cursor-pointer border hover:border-blue-500 transition-all duration-250`}
            bordered={false}
          >
            <div className="flex flex-col gap-1 items-start">
              <div>
                <span>Email: </span>
                <span>{profile.email}</span>
              </div>
              <div>
                <span>CCCD: </span>
                <span>{profile.cccd}</span>
              </div>
              <div>
                <span>Số điện thoại: </span>
                <span>{profile.phone}</span>
              </div>
              <div>
                <span>Dân tộc: </span>
                <span>{profile.nation}</span>
              </div>
              <div>
                <span>Nghề nghiệp: </span>
                <span>{profile.profession}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* <div className="flex justify-end gap-2 pt-5">
        <Link
          className="flex items-center gap-2 justify-center border border-dashed rounded-lg px-4 py-1 border-gray-600"
          href={`/user?tag=add-patient-profile&backHref=${url}`}
        >
          <BiPlus />
          Thêm hồ sơ
        </Link>
        <Button type="text" onClick={() => toast("Cập nhật sau...")}>
          Chi tiết
        </Button>
      </div> */}

      <div className="pt-5">
        <h4 className="text-base mb-2 text-left">Lý do khám</h4>
        <TextArea
          value={descStatusPatient}
          onChange={(e) => setDescStatusPatient(e.target.value)}
          title=""
          placeholder="Mô tả ngắn gọn tình trạng của bạn..."
        />
      </div>
      <div className="flex justify-end gap-4 py-5">
        <Button type="dashed" onClick={previous}>
          Trở lại
        </Button>
        <Button
          type={patientProfile && descStatusPatient ? "primary" : "dashed"}
          onClick={handleClickContinue}
          disabled={!(patientProfile && descStatusPatient)}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
