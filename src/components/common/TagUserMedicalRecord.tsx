"use client";

import { API_CODE, API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { Code, PatientProfile } from "@/models";
import { ResDataPaginations } from "@/types";
import { Avatar, Input, Tab, Tabs, useDisclosure } from "@nextui-org/react";
import { Key, useState } from "react";
import useSWR from "swr";
import { TagBookingUser } from "./TagBookingUser";
import { useAuth } from "@/hooks";
import AvatarUser from "../../assets/images/user/avtuser.jpg";
import { Image } from "@nextui-org/image";
import { Button } from "@nextui-org/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaChangePass, schemaStaffBody } from "@/schema-validate";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { InputField } from "../form";
import moment from "moment";
import { calculateAge } from "@/untils/common";
import { HiArrowLeftCircle, HiMiniDevicePhoneMobile } from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { LoadingPage } from "../spinners";
import MediCalRecordUser from "../check-up/MediCalRecordUser";

export default function TagUserMedicalRecord() {
  const { profile } = useAuth();

  const { isOpen, onClose, onOpen } = useDisclosure({ id: "details" });
  const [profileViewer, setProfileViewer] = useState<
    PatientProfile | undefined
  >();
  const { data: responsePatientProfile, mutate: mutatePatientProfile } = useSWR<
    ResDataPaginations<PatientProfile>
  >(`${API_PATIENT_PROFILE}?userId=${profile?.id || ""}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  return (
    <motion.div
      className="box-white"
      initial={false}
      animate={!isOpen ? { minHeight: "240px" } : { minHeight: "400px" }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key={1}
            style={{ overflow: "hidden" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, height: "120px" }}
          >
            <h3 className="text-lg font-semibold ">Chọn hồ sơ</h3>
            <div className="grid grid-cols-2 mt-4 gap-4">
              {responsePatientProfile?.rows.map((p: PatientProfile) => (
                <div
                  key={p.cccd}
                  onClick={() => {
                    setProfileViewer(p);
                    onOpen();
                  }}
                  className="flex flex-row rounded-lg  items-center border-gray-200/80  p-3 px-6 border hover:border-blue-600 transition-all
                       active:border-blue-700
                     "
                >
                  <div className="relative flex-shrink-0">
                    <Avatar name={p?.fullName} alt="img" size="md"></Avatar>

                    <div
                      className="absolute -right-2 bottom-5 h-4 w-4 z-10 sm:top-1 rounded-full
                          border-4 border-white bg-green-400 sm:invisible md:visible"
                      title="User is online"
                    ></div>
                  </div>

                  <div className="flex flex-col px-5 flex-1">
                    <div className="flex h-7  items-center flex-1 flex-row justify-between gap-2">
                      <h2 className="text-lg font-semibold">{p?.fullName}</h2>

                      <div className="text-sm opacity-75">
                        {calculateAge(p.birthDay)} tuổi
                      </div>
                    </div>

                    <div className=" flex flex-row space-x-2">
                      <div className="flex flex-row">
                        <HiMiniDevicePhoneMobile className="mr-1 h-4 w-4 fill-gray-500/80" />

                        <div className="text-xs text-gray-400/80 hover:text-gray-400">
                          {p?.phone}
                        </div>
                      </div>

                      <div className="flex flex-row">
                        <svg
                          className="mr-1 h-4 w-4 fill-gray-500/80"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,14 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z" />
                        </svg>

                        <div className="text-xs text-gray-400/80 hover:text-gray-400">
                          {p?.cccd}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={2}
            className=" p-3 "
            style={{ overflow: "hidden" }}
            transition={{ duration: 0.4 }}
            initial={{ opacity: 0, height: "max-content" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: "120px" }}
          >
            <div
              className="mb-1"
              onClick={() => {
                setProfileViewer(undefined);
                onClose();
              }}
            >
              <HiArrowLeftCircle size={26} color="#1b3c74" />
            </div>
            <h3 className="text-center text-lg font-semibold">
              Hồ sơ bệnh án của {profileViewer?.fullName}
            </h3>

            <div className="mt-4">
              <MediCalRecordUser cccd={profileViewer?.cccd} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
