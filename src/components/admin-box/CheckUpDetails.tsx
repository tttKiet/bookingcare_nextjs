"use client";

import { API_DOCTOR_BOOKING } from "@/api-services/constant-api";
import { Booking, ResBookingAndHealthRecord } from "@/models";
import { ResDataPaginations } from "@/types";
import { createContext, useEffect, useState } from "react";
import useSWR, { KeyedMutator } from "swr";
import PatientProfileSlot from "../check-up/PatientProfileSlot";
import InforBookingSlot from "../check-up/InforBookingSlot";

export const InfoCheckUpContext = createContext<{ bookingId: string }>({
  bookingId: "",
});

export interface ICheckUpDetailsProps {
  bookingId: string;
}

export default function CheckUpDetails({ bookingId }: ICheckUpDetailsProps) {
  const [inforBooking, setInforBooking] = useState<Booking | undefined>();

  const { data: data, mutate } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${bookingId}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  return (
    <div>
      <InfoCheckUpContext.Provider value={{ bookingId }}>
        <InforBookingSlot />
        <PatientProfileSlot />
      </InfoCheckUpContext.Provider>
    </div>
  );
}
