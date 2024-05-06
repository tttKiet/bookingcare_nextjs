"use client";

import { staffApi } from "@/api-services";
import {
  API_BOOKING,
  API_DOCTOR_BOOKING,
  API_HEALTH_RECORD,
} from "@/api-services/constant-api";
import { MethodPayment } from "@/components/common/step-boking/PaymentInformation";
import { ModalFadeInNextUi } from "@/components/modal/ModalFadeInNextUi";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import doctorFeMale from "../../../../assets/images/doctor/female_doctor.png";
import doctorMale from "../../../../assets/images/doctor/male_doctor.png";
import {
  BookingForUser,
  HealthRecord,
  ResBookingAndHealthRecord,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { getColorChipCheckUp, getColorChipHR } from "@/untils/common";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { Button } from "@nextui-org/button";
import { Chip, Divider, useDisclosure, User } from "@nextui-org/react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HiArrowLeftCircle } from "react-icons/hi2";
export interface IBookingUserDetail {}

export default function BookingUserDetail({
  params,
}: {
  params: { bookingId: string };
}) {
  // state
  const { isOpen, onClose, onOpen } = useDisclosure();

  // fetch
  const { data: data, mutate } = useSWR<ResDataPaginations<BookingForUser>>(
    `${API_BOOKING}?bookingId=${params.bookingId}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const { data: dataHealthRecord } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${params.bookingId}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  const healthRecord: HealthRecord | undefined = useMemo(
    () => dataHealthRecord?.rows?.[0]?.healthRecord,
    [dataHealthRecord]
  );
  const [address, setAddress] = useState<string>("");
  const router = useRouter();
  async function onCancelSchedule() {
    const api = staffApi.editCodeBooking({
      status: "CU4",
      id: params.bookingId,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutate();
      onClose();
    }
  }

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
    () => getColorChipCheckUp(data?.rows?.[0]?.Code?.key),
    [data?.rows?.[0]?.Code?.key]
  );

  const wrapClass = "flex items-center justify-between gap-2 my-4";
  const labelClass = "text-[#000]/70 min-w-[140px]";
  const contentClass = "text-black text-right font-medium flex-1";

  return (
    <div className="bg-[#f5f5f5]">
      <div
        className="mb-1 container mx-auto cursor-pointer hover:opacity-80 pt-8 "
        onClick={router.back}
      >
        <HiArrowLeftCircle size={26} color="#1b3c74" />
      </div>
      <div className="min-h-screen flex justify-center py-4  ">
        <div className="container">
          <div className="box-white shadow-lg border">
            <h5 className="text-xl mb-6 font-medium bg-blue-300/20 backdrop-blur-sm p-3 text-center rounded-md">
              THÔNG TIN LỊCH HẸN
            </h5>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-5 flex justify-between items-start gap-8">
                <div className="my-6 w-full">
                  <h5 className="my-2 text-sm font-bold">
                    Thông tin bệnh nhân
                  </h5>

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
                    <div className="line-clamp-1">Địa chỉ liên hệ</div>
                    <div className={contentClass}>{address}</div>
                  </div>

                  <h5 className="my-2 text-sm font-bold">Hành động</h5>

                  <div className={wrapClass}>
                    {(!healthRecord || healthRecord?.statusCode != "HR4") && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={onOpen}
                      >
                        Hủy lịch
                      </Button>
                    )}

                    {data?.rows?.[0]?.status == "CU4" && (
                      <Link href="/health-facility">
                        <Button color="primary" onPress={onOpen}>
                          Đặt lịch khác
                        </Button>
                      </Link>
                    )}
                    {healthRecord && (
                      <div className="flex justify-between gap-2 flex-1">
                        <div className={labelClass}>Phiếu khám</div>

                        <Chip
                          className="capitalize"
                          color={getColorChipHR(healthRecord?.statusCode)}
                          radius="sm"
                          size="sm"
                          variant="flat"
                        >
                          {healthRecord?.status.value}
                        </Chip>
                      </div>
                    )}
                  </div>
                  {healthRecord && (
                    <div className="text-sm text-blue-500 underline-offset-1 cursor-pointer">
                      Xem chi tiết phiếu khám bệnh
                    </div>
                  )}
                </div>
                <Divider orientation="vertical" className="h-[200px]" />
              </div>
              <div className="col-span-12 md:col-span-7">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <User
                      className="text-base"
                      description={`Bác sĩ | ${data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff.Specialist.name}`}
                      name={
                        data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                          .fullName
                      }
                      avatarProps={{
                        radius: "lg",
                        src:
                          data?.rows?.[0]?.HealthExaminationSchedule.Working
                            .Staff.gender == "male"
                            ? doctorMale.src
                            : doctorFeMale.src,
                      }}
                    >
                      {
                        data?.rows?.[0]?.HealthExaminationSchedule.Working.Staff
                          .fullName
                      }
                    </User>
                    {healthRecord?.statusCode == "HR4" && (
                      <Link
                        href={`/profile-doctor/${data?.rows?.[0]?.HealthExaminationSchedule?.Working?.staffId}`}
                      >
                        <Button color="primary">Đánh giá</Button>
                      </Link>
                    )}
                  </div>

                  <div className="my-6">
                    <h5 className="my-2 text-sm font-bold">
                      Thông tin lịch hẹn
                    </h5>
                    <div className={wrapClass}>
                      <div className={labelClass}>Mã lịch hẹn</div>
                      <div className={contentClass}>{data?.rows?.[0]?.id}</div>
                    </div>
                    <div className={wrapClass}>
                      <div className={labelClass}>Ngày khám</div>
                      <div className={contentClass}>
                        <Chip color="warning" variant="flat" radius="sm">
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
                        {
                          data?.rows?.[0]?.workRoom.ClinicRoom.HealthFacility
                            .name
                        }
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
                    <h5 className="my-2 text-sm font-bold">Bác sĩ khám bệnh</h5>

                    <div className={wrapClass}>
                      <div className={labelClass}>Bác sĩ</div>
                      <div className={contentClass}>
                        {
                          data?.rows?.[0]?.HealthExaminationSchedule.Working
                            .Staff.fullName
                        }
                        <span> | </span>
                        {data?.rows?.[0]?.HealthExaminationSchedule.Working
                          .Staff.gender == "male"
                          ? "Nam"
                          : "Nữ"}
                      </div>
                    </div>
                    <div className={wrapClass}>
                      <div className={labelClass}>Chuyên khoa</div>
                      <div className={contentClass}>
                        {
                          data?.rows?.[0]?.HealthExaminationSchedule.Working
                            .Staff.Specialist.name
                        }
                      </div>
                    </div>
                    <div className={wrapClass}>
                      <div className={labelClass}>Email</div>
                      <div className={contentClass}>
                        {
                          data?.rows?.[0]?.HealthExaminationSchedule.Working
                            .Staff.email
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
                      <div className={`${labelClass} font-bold`}>
                        Trạng thái
                      </div>
                      <div className={contentClass}>
                        <Chip color={colorSelected} variant="flat" radius="sm">
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

        <>
          <ModalFadeInNextUi
            show={isOpen}
            toggle={onClose}
            body={
              <div>
                Nếu hủy lịch quá nhiều lần bạn có thể sẽ bị khóa tài khoản?
              </div>
            }
            id=""
            handleSubmit={onCancelSchedule}
            contentBtnCancel="Trở lại"
            contentBtnSubmit="Đồng ý"
            title="Bạn chắc chắn hủy cuộn hẹn này?"
          />
        </>
      </div>
    </div>
  );
}
