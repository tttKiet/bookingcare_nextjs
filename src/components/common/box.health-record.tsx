import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthRecord } from "@/models";
import { Button, Divider } from "antd";
import moment from "moment";
import * as React from "react";

export interface IHealthRecordItemProps {
  healthRecord: HealthRecord | undefined;
}

export function HealthRecordItem({ healthRecord }: IHealthRecordItemProps) {
  const { address: addressRaw } = useGetAddress({
    provinceCode: healthRecord?.Booking?.PatientProfile?.addressCode[2] || "",
    districtCode: healthRecord?.Booking?.PatientProfile?.addressCode[1] || "",
    wardCode: healthRecord?.Booking?.PatientProfile?.addressCode[0] || "",
  });
  return (
    <div className="p-4 pb-6 px-10 max-w-[426px] border rounded-3xl shadow-lg bg-white ">
      <header>
        <h3 className="text-lg text-center p-2 pt-3 text-black font-medium">
          Phiếu khám bệnh
        </h3>
        <div className="p-2 pb-4">
          <h5 className="text-center text-base mb-1  text-gray-800">
            {healthRecord?.WorkRoom?.ClinicRoom?.HealthFacility?.name}
          </h5>
          <p className="text-center text-sm  text-gray-500">
            {healthRecord?.WorkRoom?.ClinicRoom?.HealthFacility?.address}
          </p>
        </div>
        <div className="flex mb-4 justify-center">
          <span
            className={`
            border border-dashed
            rounded-md px-4 py-1
            ${
              healthRecord?.status.key == "S1"
                ? "bg-pink-100 text-pink-500 border-pink-400"
                : ""
            }
            ${
              healthRecord?.status.key == "S2"
                ? "bg-blue-100 text-blue-600 border-blue-500"
                : ""
            }
            ${
              healthRecord?.status.key == "S3"
                ? "bg-red-100 text-red-600 border-red-500"
                : ""
            }
          `}
          >
            {healthRecord?.status.value}
          </span>
        </div>
        <p className="text-center text-sm text-red-500 font-light">
          Phiếu này xác nhận bạn đã đặt lịch thành công. Nếu bạn đã thanh toán
          và hủy trước ngày khám, phí khám sẽ được hoàn lại từ 1-45 ngày theo
          quy định của cổng thanh toán/ngân hàng. Vui lòng liên hệ 19002115 để
          được hỗ trợ.
        </p>
      </header>
      <Divider dashed />
      <main className="text-sm">
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Mã phiếu:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {healthRecord?.id}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600 ">Ngày khám:</span>
          <span className="flex-1 text-blue-500 min-w-[200px] font-medium text-right">
            {moment(
              healthRecord?.Booking.HealthExaminationSchedule.date
            ).format("L")}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Giờ khám:</span>
          <span className="flex-1  min-w-[200px] font-medium text-right text-blue-600">
            {healthRecord?.Booking.HealthExaminationSchedule.TimeCode.value}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Dịch vụ:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            Khám dịch vụ
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Phòng khám:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {healthRecord?.WorkRoom.ClinicRoomRoomNumber}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Chuyên khoa:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {
              healthRecord?.Booking.HealthExaminationSchedule.Working.Staff
                .Specialist.name
            }
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Bác sỉ:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {
              healthRecord?.Booking.HealthExaminationSchedule.Working.Staff
                .fullName
            }
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Phí khám:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {healthRecord?.WorkRoom?.checkUpPrice?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Bệnh nhân:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {healthRecord?.Booking.PatientProfile.fullName}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Ngày sinh:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {moment(healthRecord?.Booking.PatientProfile.birthDay).format(
              "DD/MM/YYYY"
            )}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Địa chỉ:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {addressRaw}
          </span>
        </div>
        <div className="flex items-start justify-between gap-2 my-3">
          <span className="flex-1 text-gray-600">Ngày đặt lịch:</span>
          <span className="flex-1 text-black min-w-[200px] font-medium text-right">
            {moment(healthRecord?.Booking.createdAt).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </span>
        </div>
        <Divider dashed />
        <div className="">
          <h3 className="text-sm text-center">
            Bản quyền thuộc về{" "}
            <span className="text-base text-blue-600">BOOKING CARE</span>
          </h3>
          <p className="text-xs text-gray-500 text-center">
            Đặt lịch khám tại Bệnh viện - Phòng khám hàng đầu Việt Nam
          </p>
        </div>
      </main>
    </div>
  );
}
