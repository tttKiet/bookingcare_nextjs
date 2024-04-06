"use client";

import { API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfile } from "@/models";
import { ResDataPaginations } from "@/types";
import { Card, Divider } from "antd";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import toast from "react-hot-toast";
import { BiPlus } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import useSWR from "swr";
// const { TextArea } = Input;
import { motion, Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input, ScrollShadow, Textarea, User } from "@nextui-org/react";
import debounce from "lodash.debounce";
import { SearchIcon } from "@/components/icons/SearchIcon";

export interface ChooseScheduleProps {
  next: (step: number, value: any) => void;
  previous: () => void;
}

export function ChoosePatientProfile({ next, previous }: ChooseScheduleProps) {
  const { profile } = useAuth();
  const [descStatusPatient, setDescStatusPatient] = useState<string>("");
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );
  const [searchName, setSearchName] = useState<string>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams.toString()}`;
  const { data: responsePatientProfile, mutate: mutatePatientProfile } = useSWR<
    ResDataPaginations<PatientProfile>
  >(
    `${API_PATIENT_PROFILE}?userId=${
      profile?.id || ""
    }&profileName=${searchName}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function handleSearchName(value: string) {
    setSearchName(value);
  }

  const variants = useMemo(
    () => ({
      container: {
        initial: { opacity: 0, x: 100 },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            when: "beforeChildren",
            staggerChildren: 3,
          },
        },
      },

      item: {
        initial: { opacity: 0, x: 200 },
        visible: (i: number) => ({
          opacity: 1,
          x: 0,

          transition: {
            delay: i * 0.3,
            duration: 0.2,
          },
        }), // Thay đổi giá trị delay tùy theo nhu cầu
      },
    }),
    []
  );
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
    <div className=" flex flex-col justify-between min-h-[300px]">
      <div>
        <div className="">
          <Input
            label="Tìm kiếm hồ sơ"
            radius="sm"
            isClearable={false}
            onChange={debounce(function (e) {
              handleSearchName(e.target.value);
            }, 300)}
            classNames={{
              label: "text-black/50 text-base",
              innerWrapper: "bg-transparent ",
              // base: "border border-slate-400 rounded-sm",
            }}
            className="border border-slate-400/20 rounded-md"
            placeholder="Nhập tên người khám..."
            startContent={
              <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
            }
          />

          <ScrollShadow className="h-[400px] my-4 pr-[4px]">
            {responsePatientProfile?.rows.map(
              (profile: PatientProfile, index: any) => (
                <Card
                  key={profile.id}
                  onClick={() => handleClickCard(profile)}
                  title={
                    <div className="text-left my-3 flex items-center">
                      <User
                        avatarProps={{ radius: "md" }}
                        description={`${profile.cccd}`}
                        name={`${profile.fullName}`}
                        className="text-left font-bold"
                      >
                        {profile.fullName}
                      </User>
                      {/* <h5 className="text-blue-500 text-left ">
                        {profile.fullName}
                      </h5> */}
                    </div>
                  }
                  className={`${
                    profile.id === patientProfile?.id
                      ? " border-blue-600"
                      : "border-gray-200"
                  } cursor-pointer border hover:border-blue-500 transition-all duration-250 my-4 px-4`}
                  bordered={false}
                >
                  <div className="flex flex-col gap-1 items-start">
                    <div>
                      <span className="font-bold mr-1">Email: </span>
                      <span>{profile.email}</span>
                    </div>
                    <div>
                      <span className="font-bold mr-1">CCCD: </span>
                      <span>{profile.cccd}</span>
                    </div>
                    <div>
                      <span className="font-bold mr-1">Số điện thoại: </span>
                      <span>{profile.phone}</span>
                    </div>
                    <div>
                      <span className="font-bold mr-1">Dân tộc: </span>
                      <span>{profile.nation}</span>
                    </div>
                    <div>
                      <span className="font-bold mr-1">Nghề nghiệp: </span>
                      <span>{profile.profession}</span>
                    </div>
                  </div>
                </Card>
              )
            )}
          </ScrollShadow>
        </div>

        <div className="pt-5 text-left">
          {/* <h4 className="text-base mb-2 text-left">Lý do khám</h4> */}
          {/* <TextArea
              value={descStatusPatient}
              onChange={(e) => setDescStatusPatient(e.target.value)}
              title=""
              placeholder="Mô tả ngắn gọn tình trạng của bạn..."
            /> */}

          <Textarea
            isRequired
            value={descStatusPatient}
            onChange={(e) => setDescStatusPatient(e.target.value)}
            label={<span className="text-base mb-2 text-left">Lý do khám</span>}
            labelPlacement="outside"
            placeholder="Mô tả ngắn gọn tình trạng của bạn..."
          />
        </div>
      </div>
      {/* <p className=" py-3 pt-6 text-gray-500 text-center">
          Vui lòng thêm
          <Link
            href={"/user?tag=add-patient-profile"}
            className="font-semibold text-blue-500 ml-1"
          >
            hồ sơ khám bệnh
          </Link>
        </p> */}
      <div className="flex justify-end gap-4 py-5">
        <Button onClick={previous} size="md">
          Trở lại
        </Button>
        <Button
          color={patientProfile && descStatusPatient ? "primary" : "default"}
          size="md"
          onClick={handleClickContinue}
          className={
            patientProfile && descStatusPatient
              ? "cursor-pointer"
              : "cursor-default select-none"
          }
          disabled={!(patientProfile && descStatusPatient)}
        >
          Tiếp tục
        </Button>
      </div>
    </div>
  );
}
