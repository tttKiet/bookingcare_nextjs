"use client";

import { API_DOCTOR_BOOKING } from "@/api-services/constant-api";
import { Booking, ResBookingAndHealthRecord } from "@/models";
import { ResDataPaginations } from "@/types";
import { createContext, useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import { Tab, Tabs } from "@nextui-org/react";
import DetailsTabCheckUp from "../check-up/DetailsTabCheckUp";
import dynamic from "next/dynamic";
import { LoadingPage } from "../spinners";
import MedicalRecord from "../check-up/MedicalRecord";

export const InfoCheckUpContext = createContext<{ bookingId: string }>({
  bookingId: "",
});

export interface ICheckUpDetailsProps {
  bookingId: string;
}
const InforBookingSlot = dynamic(() => import("../check-up/InforBookingSlot"), {
  loading: () => <LoadingPage />,
  ssr: false,
});
const PatientProfileSlot = dynamic(
  () => import("../check-up/PatientProfileSlot"),
  {
    loading: () => <LoadingPage />,
    ssr: false,
  }
);

export default function CheckUpDetails({ bookingId }: ICheckUpDetailsProps) {
  const [inforBooking, setInforBooking] = useState<Booking | undefined>();

  const { data: data, mutate } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${bookingId}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  return (
    <div className="text-left">
      <InfoCheckUpContext.Provider value={{ bookingId }}>
        {/* <PatientProfileSlot /> */}
        <Tabs
          color="primary"
          aria-label="Tabs colors"
          radius="sm"
          className="text-left"
        >
          <Tab key="booking" title="Lịch hẹn" children={<InforBookingSlot />} />
          <Tab
            key="patient"
            title="Thông tin bệnh nhân"
            children={<PatientProfileSlot />}
          />
          <Tab
            key="medical_record"
            title="Hồ sơ bệnh án"
            children={<MedicalRecord />}
          />
          <Tab
            key="health"
            title="Phiếu khám bệnh"
            children={<DetailsTabCheckUp />}
          />
        </Tabs>
      </InfoCheckUpContext.Provider>
    </div>
  );
}
