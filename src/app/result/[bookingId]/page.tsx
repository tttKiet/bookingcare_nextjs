"use client";

import { API_BOOKING } from "@/api-services/constant-api";
import { BookingForUser } from "@/models";
import { ResDataPaginations } from "@/types";
import { Button } from "@nextui-org/button";
import { Result } from "antd";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

export default function HospitalPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { data: data, mutate } = useSWR<ResDataPaginations<BookingForUser>>(
    `${API_BOOKING}?bookingId=${params.bookingId}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const bookingData = useMemo<BookingForUser>(() => {
    return data?.rows?.[0];
  }, [data]);
  return (
    <div>
      <Result
        className="h-screen"
        status="success"
        title={"Thanh toán thành công"}
        subTitle={
          <div>
            <div>{`Mã lịch hẹn: ${
              bookingData?.id
            } | Số tiền: ${bookingData?.doctorPrice?.toLocaleString()} vnđ | Ngày đặt: ${moment(
              bookingData?.createdAt
            ).format("lll")}`}</div>

            <span>
              {bookingData?.HealthExaminationSchedule?.TimeCode?.value}
            </span>
          </div>
        }
        extra={[
          <Link href={"/user/booking/" + bookingData?.id}>
            <Button color="primary">Xem lịch đặt</Button>
          </Link>,
          <Link href={"/health-facility"}>
            <Button>Đặt lịch hẹn khác</Button>
          </Link>,
        ]}
      />
    </div>
  );
}
