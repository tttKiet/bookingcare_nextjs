"use client";

import { API_BOOKING } from "@/api-services/constant-api";
import { MethodPayment } from "@/components/common/step-boking/PaymentInformation";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { BookingForUser } from "@/models";
import { ResDataPaginations } from "@/types";
import { getColorChipCheckUp } from "@/untils/common";
import { Chip, Divider, User } from "@nextui-org/react";
import { Button } from "antd";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
export interface IBookingUserDetail {}

export default function BookingUserDetail({
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
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    useGetAddress({
      wardCode: data?.rows?.[0]?.PatientProfile.addressCode?.[0] || "",
      districtCode: data?.rows?.[0]?.PatientProfile.addressCode?.[1] || "",
      provinceCode: data?.rows?.[0]?.PatientProfile.addressCode?.[2] || "",
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [
    data?.rows?.[0]?.PatientProfile.addressCode?.[0],
    data?.rows?.[0]?.PatientProfile.addressCode?.[1],
    data?.rows?.[0]?.PatientProfile.addressCode?.[2],
  ]);

  const colorSelected = useMemo(
    () => getColorChipCheckUp(data?.rows?.[0]?.Code?.value),
    [data?.rows?.[0]?.Code?.value]
  );

  const wrapClass = "flex items-center justify-between gap-2 my-4";
  const labelClass = "text-[#000]/70 min-w-[140px]";
  const contentClass = "text-black font-medium";

  return (
    <div className="min-h-screen flex justify-center py-8  ">
      <div className="container">
        <div className="box-white">
          <h5 className="text-xl mb-6">THÔNG TIN LỊCH HẸN</h5>
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-5 flex justify-between items-start gap-8">
              <div className="my-6">
                <h5 className="my-2 text-sm font-bold">Thông tin bệnh nhân</h5>

                <div className={wrapClass}>
                  <div className={labelClass}>Tên bệnh nhân</div>
                  <div className={contentClass}>
                    {data?.rows?.[0]?.PatientProfile.fullName}
                  </div>
                </div>
                <div className={wrapClass}>
                  <div className={labelClass}>Số CCCD</div>
                  <div className={contentClass}>
                    {data?.rows?.[0]?.PatientProfile.cccd.slice(0, -3)}***
                  </div>
                </div>
                <div className={wrapClass}>
                  <div className={labelClass}>Số điện thoại</div>
                  <div className={contentClass}>
                    {data?.rows?.[0]?.PatientProfile.phone}
                  </div>
                </div>
                <div className={wrapClass}>
                  <div className={labelClass}>Email</div>
                  <div className={contentClass}>
                    {data?.rows?.[0]?.PatientProfile.email}
                  </div>
                </div>
                <div className={wrapClass}>
                  <div className={labelClass}>Địa chỉ liên hệ</div>
                  <div className={contentClass}>{address}</div>
                </div>
              </div>
              <Divider orientation="vertical" className="h-[200px]" />
            </div>
            <div className="col-span-12 md:col-span-7">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <User
                    className="text-base"
                    avatarProps={{ radius: "lg" }}
                    description={`Doctor | ${data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff.Specialist.name}`}
                    name={
                      data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                        .fullName
                    }
                  >
                    {
                      data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                        .fullName
                    }
                  </User>
                  {data?.rows?.[0]?.status == "C3" && (
                    <Button color="primary">Đánh giá</Button>
                  )}
                </div>

                <div className="my-6">
                  <h5 className="my-2 text-sm font-bold">Thông tin lịch hẹn</h5>
                  <div className={wrapClass}>
                    <div className={labelClass}>Mã lịch hẹn</div>
                    <div className={contentClass}>{data?.rows?.[0]?.id}</div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Ngày khám</div>
                    <div className={contentClass}>
                      <Chip color="secondary" variant="flat">
                        {
                          data?.rows?.[0]?.HealthExaminationSchedule.TimeCode
                            .value
                        }
                        ,{" "}
                        {moment(
                          data?.rows?.[0]?.HealthExaminationSchedule.date
                        ).format("L")}
                      </Chip>
                    </div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Nơi khám bệnh</div>
                    <div className={contentClass}>
                      Phòng {data?.rows?.[0]?.workRoom.ClinicRoomRoomNumber},{" "}
                      {data?.rows?.[0]?.workRoom.ClinicRoom.HealthFacility.name}
                    </div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Địa chỉ</div>
                    <div className={contentClass}>
                      {
                        data?.rows?.[0]?.workRoom.ClinicRoom.HealthFacility
                          .address
                      }
                    </div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Phòng khám</div>
                    <div className={contentClass}>
                      {data?.rows?.[0]?.workRoom?.ClinicRoomRoomNumber}
                    </div>
                  </div>
                </div>
                <div className="my-6">
                  <h5 className="my-2 text-sm font-bold">Bác sỉ khám bệnh</h5>

                  <div className={wrapClass}>
                    <div className={labelClass}>Bác sỉ</div>
                    <div className={contentClass}>
                      {
                        data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                          .fullName
                      }
                    </div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Chuyên khoa</div>
                    <div className={contentClass}>
                      {
                        data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                          .Specialist.name
                      }
                    </div>
                  </div>
                </div>
                <div className="my-6">
                  <h5 className="my-2 text-sm font-bold">
                    Thông tin thanh toán
                  </h5>

                  <div className={wrapClass}>
                    <div className={labelClass}>Phương thức thanh toán</div>
                    <div className="text-black font-bold ">
                      {data?.rows?.[0]?.paymentType &&
                        MethodPayment[
                          data?.rows?.[0]
                            ?.paymentType as keyof typeof MethodPayment
                        ]}
                    </div>
                  </div>
                  <div className={wrapClass}>
                    <div className={labelClass}>Số tiền</div>
                    <div className={contentClass}>
                      {data?.rows?.[0]?.doctorPrice.toLocaleString()} vnđ
                    </div>
                  </div>
                </div>
                <Divider />
                <div className="my-6">
                  <div className={wrapClass}>
                    <div className={labelClass}>Trạng thái</div>
                    <div className={contentClass}>
                      <Chip color={colorSelected} variant="flat">
                        {data?.rows?.[0]?.Code.value}
                      </Chip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
