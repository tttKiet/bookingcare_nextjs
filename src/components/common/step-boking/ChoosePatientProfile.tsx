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
import { motion, Variants } from "framer-motion";

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

  const variants = React.useMemo(
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
      {responsePatientProfile?.rows.length > 0 ? (
        <div>
          <div className="">
            <motion.div
              animate="visible"
              initial="initial"
              variants={variants.container}
              className="grid grid-cols-2 gap-6"
            >
              {responsePatientProfile?.rows.map(
                (profile: PatientProfile, index: any) => (
                  <motion.div
                    animate="visible"
                    initial="initial"
                    custom={index}
                    key={profile.id}
                    variants={variants.item}
                  >
                    <Card
                      onClick={() => handleClickCard(profile)}
                      title={
                        <h5 className="text-blue-500">{profile.fullName}</h5>
                      }
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
                  </motion.div>
                )
              )}
            </motion.div>
          </div>

          <div className="pt-5">
            <h4 className="text-base mb-2 text-left">Lý do khám</h4>
            <TextArea
              value={descStatusPatient}
              onChange={(e) => setDescStatusPatient(e.target.value)}
              title=""
              placeholder="Mô tả ngắn gọn tình trạng của bạn..."
            />
          </div>
        </div>
      ) : (
        <p className=" py-3 pt-6 text-gray-500 text-center">
          Vui lòng thêm
          <Link
            href={"/user?tag=add-patient-profile"}
            className="font-semibold text-blue-500 ml-1"
          >
            hồ sơ khám bệnh
          </Link>
        </p>
      )}
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
