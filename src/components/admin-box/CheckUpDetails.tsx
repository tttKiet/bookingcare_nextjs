"use client";

import { API_DOCTOR_BOOKING } from "@/api-services/constant-api";
import { Booking } from "@/models";
import { ResDataPaginations } from "@/types";
import { createContext, useEffect, useState } from "react";
import useSWR from "swr";
import PatientProfileSlot from "../check-up/PatientProfileSlot";

export const InfoCheckUpContext = createContext<Booking | undefined>(undefined);

export interface ICheckUpDetailsProps {
  bookingId: string;
}

export default function CheckUpDetails({ bookingId }: ICheckUpDetailsProps) {
  const [inforBooking, setInforBooking] = useState<Booking | undefined>();

  const { data: data, mutate } = useSWR<ResDataPaginations<Booking>>(
    `${API_DOCTOR_BOOKING}?bookingId=${bookingId}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  useEffect(() => {
    if (data?.rows?.[0]) setInforBooking(data?.rows?.[0]);
  }, [data?.rows?.[0]]);

  return (
    <div>
      <InfoCheckUpContext.Provider value={inforBooking}>
        <PatientProfileSlot />
      </InfoCheckUpContext.Provider>
    </div>
  );
}
