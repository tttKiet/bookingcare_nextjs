"use client";

import {
  API_BOOKING,
  API_CODE,
  API_DOCTOR_BOOKING,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SERVICE_DETAILS,
  API_PATIENT_PROFILE,
} from "@/api-services/constant-api";
import {
  BookingForUser,
  Code,
  PatientProfile,
  PrescriptionDetail,
  ResBookingAndHealthRecord,
  ServiceDetails,
} from "@/models";
import { ResDataPaginations } from "@/types";
import {
  Avatar,
  Chip,
  Divider,
  Input,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useMemo, useState } from "react";
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
import { HiOutlineCalendar, HiOutlineDocumentDownload } from "react-icons/hi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ServiceDetailsBillDocument from "../pdf/ServiceDetailsBillDocument";
import CedicineDocument from "../pdf/CedicineDocument";

export default function TagUserResult() {
  const { profile } = useAuth();

  const { isOpen, onClose, onOpen } = useDisclosure({ id: "details" });

  const [profileViewer, setProfileViewer] = useState<
    BookingForUser | undefined
  >();

  const { data: resBookingAndHealthRecord, mutate } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${profileViewer?.id || ""}`, {
    revalidateOnMount: false,
    dedupingInterval: 5000,
  });

  const bookingAndHealthRecordViewer: ResBookingAndHealthRecord =
    useMemo(() => {
      return resBookingAndHealthRecord?.rows?.[0] || null;
    }, [resBookingAndHealthRecord, profileViewer]);

  const { data: responseBooking } = useSWR<ResDataPaginations<BookingForUser>>(
    `${API_BOOKING}?status=CU2`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const { data: dataServiceDetails, mutate: mutateServiceDetails } = useSWR<
    ServiceDetails[]
  >(
    `${API_DOCTOR_SERVICE_DETAILS}?healthRecordId=${bookingAndHealthRecordViewer?.healthRecord?.id}`
  );

  const { data: dataPrescriptionDetail, mutate: mutatePrescriptionDetail } =
    useSWR<PrescriptionDetail[]>(
      `${API_DOCTOR_PRESCRIPTION_DETAILS}?limit=500&offset=0&healthRecordId=${bookingAndHealthRecordViewer?.healthRecord?.id}`
    );

  return (
    <motion.div
      className="box-white"
      initial={false}
      animate={!isOpen ? { minHeight: "200px" } : { minHeight: "500px" }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key={1}
            style={{ overflow: "hidden" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            exit={{ opacity: 0, height: "120px" }}
          >
            <h3 className="text-lg font-semibold ">Chọn lịch khám</h3>
            <div className="grid grid-cols-2 mt-4 gap-4">
              {responseBooking?.rows.map((p: BookingForUser) => (
                <div
                  key={p.PatientProfile.fullName}
                  onClick={() => {
                    setProfileViewer(p);
                    onOpen();
                  }}
                  className="flex flex-row rounded-lg  items-start border-gray-200/80  p-3 px-6 border hover:border-blue-600 transition-all
                       active:border-blue-700
                     "
                >
                  <div className="relative flex-shrink-0">
                    <HiOutlineCalendar size={40} />
                    <div
                      className="absolute -right-2 bottom-5 h-4 w-4 z-10 sm:top-1 rounded-full
                          border-4 border-white bg-green-400 sm:invisible md:visible"
                      title="User is online"
                    ></div>
                  </div>

                  <div className="flex flex-col px-5 flex-1">
                    <div className="flex h-7  items-start flex-1 flex-row justify-between gap-2">
                      <h2 className="text-base font-semibold">
                        <span>
                          {moment(p?.HealthExaminationSchedule.date).format(
                            "L"
                          )}
                        </span>
                        <span className="mx-2">|</span>
                        <span>
                          <Chip color="primary" size="sm" radius="sm">
                            {p?.HealthExaminationSchedule?.TimeCode.value}
                          </Chip>
                        </span>
                      </h2>
                    </div>

                    <div className=" flex flex-row space-x-2 mt-2">
                      <div className="text-xs text-gray-700/80 hover:text-gray-400">
                        <span className="font-medium">Người khám: </span>

                        <span className="font-medium text-black">
                          {p?.PatientProfile?.fullName}
                        </span>
                      </div>
                    </div>

                    <div className=" flex flex-row space-x-2 mt-2">
                      <div className="text-xs text-gray-700/80 hover:text-gray-400">
                        <span className="font-medium">Đặt khám bác sĩ: </span>

                        <span className="font-medium text-black">
                          {
                            p?.HealthExaminationSchedule?.Working?.Staff
                              ?.fullName
                          }
                        </span>
                      </div>
                    </div>
                    {/* <div className=" flex flex-row space-x-2 mt-2">
                      <div className="text-xs text-gray-700/80 hover:text-gray-400">
                        <span className="font-medium">Người khám: </span>

                        <span className="font-medium text-black">
                          {p?.PatientProfile?.fullName}
                        </span>
                      </div>
                    </div> */}
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
            initial={{ opacity: 1, height: "max-content" }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: "120px" }}
          >
            <div
              className="mb-1 cursor-pointer hover:opacity-80 transition-all"
              onClick={() => {
                setProfileViewer(undefined);
                onClose();
              }}
            >
              <HiArrowLeftCircle size={26} color="#1b3c74" />
            </div>
            <h3 className="text-center text-lg font-semibold">
              Kết quả khám bệnh ngày{" "}
              {moment(profileViewer?.HealthExaminationSchedule.date).format(
                "L"
              )}
            </h3>

            <div className="mt-8 flex items-start space-x-7 gap-8">
              <div className="w-4/5">
                <h4 className="text-black font-medium mb-2">
                  Thông tin lịch hẹn
                </h4>
                <div className="flex items-center justify-between gap-2 flex-1">
                  <span className="whitespace-nowrap">Tên bệnh nhân</span>
                  <span className="font-medium text-black">
                    {profileViewer?.PatientProfile?.fullName}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-1 mt-3">
                  <span className="whitespace-nowrap">CCCD </span>
                  <span className="font-medium text-black">
                    {profileViewer?.PatientProfile?.cccd}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-1 mt-3">
                  <span className="whitespace-nowrap">Bác sĩ</span>
                  <span className="font-medium text-black">
                    {
                      profileViewer?.HealthExaminationSchedule.Working?.Staff
                        ?.fullName
                    }
                  </span>
                </div>

                <h4 className="text-black font-medium mb-2 mt-5">
                  Tình trạng sức khỏe (lúc đặt lịch)
                </h4>
                <div className="flex items-center justify-between gap-2 flex-1">
                  <span className="whitespace-nowrap">Tình trạng</span>
                  <span className="font-medium text-black">
                    {bookingAndHealthRecordViewer?.booking?.descriptionDisease}
                  </span>
                </div>

                <h4 className="text-black font-medium mb-2 mt-5">
                  Thông tin chuẩn đoán của bác sĩ
                </h4>
                <div className="flex items-center justify-between gap-2 flex-1">
                  <span className="whitespace-nowrap">Chuẩn đoán bệnh</span>
                  <span className="font-medium text-black">
                    {bookingAndHealthRecordViewer?.healthRecord.diagnosis}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 flex-1 mt-3">
                  <span className="whitespace-nowrap">Ghi chú</span>
                  <span className="font-medium text-black">
                    {bookingAndHealthRecordViewer?.healthRecord.note}
                  </span>
                </div>
              </div>
              <Divider orientation="vertical" className="h-[200px]" />
              <div className="w-1/5">
                <h4 className="text-black font-medium mb-2 mt-5">Tải xuống</h4>
                <div className="flex items-center justify-between gap-2 flex-1">
                  {dataServiceDetails?.length && (
                    <>
                      <span className="whitespace-nowrap">Dịch vụ khám</span>

                      <PDFDownloadLink
                        className="block"
                        document={
                          <ServiceDetailsBillDocument
                            dataBooking={bookingAndHealthRecordViewer?.booking}
                            dataServiceDetails={dataServiceDetails}
                            healthRecord={
                              bookingAndHealthRecordViewer?.healthRecord
                            }
                          />
                        }
                        fileName="service.pdf"
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            "..."
                          ) : (
                            <span className="block font-medium text-black  cursor-pointer hover:opacity-60 duration-200 transition-all">
                              <HiOutlineDocumentDownload
                                color="blue"
                                size={20}
                              />
                            </span>
                          )
                        }
                      </PDFDownloadLink>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 flex-1 mt-2">
                  <span className="whitespace-nowrap">Toa thuốc</span>

                  <PDFDownloadLink
                    className="block"
                    document={
                      <CedicineDocument
                        dataBooking={bookingAndHealthRecordViewer?.booking}
                        prescriptionDetail={dataPrescriptionDetail}
                        healthRecord={
                          bookingAndHealthRecordViewer?.healthRecord
                        }
                      />
                    }
                    fileName="cedicine.pdf"
                  >
                    {({ blob, url, loading, error }) =>
                      loading ? (
                        "..."
                      ) : (
                        <span
                          className=" block font-medium text-black  
                        cursor-pointer hover:opacity-60 duration-200 transition-all"
                        >
                          <HiOutlineDocumentDownload color="blue" size={20} />
                        </span>
                      )
                    }
                  </PDFDownloadLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
