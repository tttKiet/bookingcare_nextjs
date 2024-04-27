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
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input, ScrollShadow, Textarea, User } from "@nextui-org/react";
import debounce from "lodash.debounce";
import { SearchIcon } from "@/components/icons/SearchIcon";
import Search from "../filter/Search";
import ProfileItem from "./ProfileItem";

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
          <Search
            size="lg"
            label="Tìm kiếm hồ sơ"
            onChange={debounce(function (e) {
              handleSearchName(e.target.value);
            }, 300)}
            placeholder="Nhập tên người khám..."
            color="primary"
          ></Search>

          <div className="max-h-[400px] overflow-y-scroll overflow-x-hidden min-h-[180px] my-4 pr-[4px]">
            {responsePatientProfile?.rows.length == 0 && (
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                }}
                exit={{ opacity: 0, x: 60 }}
              >
                <div className="flex items-center gap-2 justify-center mt-20">
                  Không tìm thấy hồ sơ, vui lòng tạo hồ sơ khám!!
                </div>
              </motion.div>
            )}
            <AnimatePresence mode="popLayout">
              {responsePatientProfile?.rows.map(
                (profile: PatientProfile, i: any) => (
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    key={i.id}
                    transition={{
                      delay: 0.2 * i,
                    }}
                    exit={{ opacity: 0, x: 60 }}
                  >
                    <ProfileItem
                      key={i.id}
                      active={profile.id === patientProfile?.id}
                      patientProfile={profile}
                      handleClickCard={handleClickCard}
                      index={i}
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
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
