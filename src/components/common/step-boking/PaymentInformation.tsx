"use client";

import { userApi } from "@/api-services";
import { paymentApi } from "@/api-services/payment-api";
import { ColorBox } from "@/components/box";
import { ModalPositionHere } from "@/components/modal";
import {
  Booking,
  HealthExaminationSchedule,
  PatientProfile,
  WorkRoom,
} from "@/models";
import { Button } from "@nextui-org/button";
import { Divider, Form, RadioChangeEvent } from "antd";
import { ChangeEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BsCreditCard2Back, BsCursor } from "react-icons/bs";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaWalletSolid } from "react-icons/lia";
import { RiServiceLine } from "react-icons/ri";
import vnpay_logo from "../../../assets/images/logo-vi-vnpay.png";
import Image from "next/image";
import { FaRegHospital } from "react-icons/fa";
import { Radio, RadioGroup } from "@nextui-org/react";

export interface IPaymentInformation {
  schedule: Partial<HealthExaminationSchedule> | null;
  patientProfile: PatientProfile | null;
  checkupInfo: WorkRoom | null;
  previous: () => void;
  confirmSuccess: ({ paymentType }: { paymentType: string }) => Promise<void>;
}
export const MethodPayment = {
  hospital: "Thanh toán tại bệnh viện",
  card: "Thanh toán bằng VNPAY",
};
type MethodKeys = keyof typeof MethodPayment;
export function PaymentInformation({
  schedule,
  patientProfile,
  previous,
  checkupInfo,
  confirmSuccess,
}: IPaymentInformation) {
  const [method, setMothod] = useState<MethodKeys | undefined>(undefined);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  function toggleShowPaymentModal() {
    setShowPaymentModal((s) => !s);
  }

  const [form] = Form.useForm();

  function onChangeMethod(e: ChangeEvent<HTMLInputElement>): void {
    const key = e.target.value as MethodKeys;
    setMothod(key);
  }
  const [isLoading, setIsloading] = useState<boolean>(false);
  async function handleClickAgreePayment() {
    const promisePaymentFake = new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    setIsloading(true);
    promisePaymentFake
      .then(() => {
        confirmSuccess({ paymentType: method || "" });
        toggleShowPaymentModal();
      })
      .finally(() => {
        setIsloading(false);
      });
  }
  function submitForm(value: any) {
    console.log(value);
    setShowPaymentModal(true);
  }

  console.log("schedule?.Working?.Staffschedule?.Working?.Staff", schedule);
  console.log("schedule?.Working?.checkupInfo?.Working?.Staff", checkupInfo);
  return (
    <>
      <ModalPositionHere
        body={
          <div className="pt-4">
            <div>
              Thanh toán số tiền{" "}
              <span className="font-medium">
                {checkupInfo?.checkUpPrice.toLocaleString()}
              </span>{" "}
              vnđ{" "}
              <span className="font-bold text-blue-500">
                {method && MethodPayment?.[method].split("Thanh toán ")[1]}.
              </span>
            </div>
            <div className="mt-4 px-4 py-2 rounded-md bg-blue-100 text-gray-700 shadow">
              Lịch hẹn được xác nhận đã thanh toán khi bạn đã thanh toán thành
              công. Trường hợp lịch hẹn không cập nhật trạng thái, vui lòng liên
              hệ 19002115.
            </div>
            <div className="flex justify-end gap-4 pt-6 mb-4">
              <Button color="danger" onClick={toggleShowPaymentModal}>
                Hủy
              </Button>
              <Button
                color={"primary"}
                isLoading={isLoading}
                onClick={handleClickAgreePayment}
              >
                Đồng ý
              </Button>
            </div>
          </div>
        }
        title="Xác nhận thanh toán"
        toggle={toggleShowPaymentModal}
        footer={false}
        show={showPaymentModal}
      />

      <Form form={form} onFinish={submitForm}>
        <div className="grid grid-cols-12 ">
          <div className="col-span-12 md:col-span-6 text-left">
            <h2 className="mb-5 font-bold flex items-center gap-2 text-[#1b3c74] text-base">
              <BsCursor size={18} />
              Chọn phương thức thanh toán
            </h2>
            <Form.Item
              name="pay_method"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phương thức thanh toán.",
                },
              ]}
            >
              <RadioGroup onChange={onChangeMethod} value={method} size="sm">
                <div className="flex justify-start flex-col text-base gap-4">
                  <Radio value={"hospital"}>
                    <span className="text-base flex items-center justify-start ml-1 gap-2">
                      {MethodPayment.hospital}
                      <FaRegHospital size={26} />
                    </span>
                  </Radio>
                  <Radio className="text-base" value={"card"}>
                    <span className="text-base flex items-center justify-start ml-1 gap-2">
                      {MethodPayment.card}
                      <Image
                        src={vnpay_logo}
                        alt="VNPAY"
                        width={60}
                        height={60}
                      />
                    </span>
                  </Radio>
                </div>
              </RadioGroup>
            </Form.Item>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div>
              <h6 className="mb-5 font-bold flex items-center gap-2 text-[#1b3c74] text-base">
                <BsCreditCard2Back size={18} />
                Thông tin thanh toán
              </h6>
              <div className="rounded-md border shadow px-6 py-4">
                <div className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2 font-medium text-base text-[#1b3c74]">
                    <IoBagAddOutline />
                    <span className="text-[#1b3c74] ">Chuyên khoa:</span>
                  </div>

                  <span className="text-[rgb(60,66,83)] ">
                    {checkupInfo?.Working?.Staff?.Specialist?.name}
                  </span>
                </div>
                <Divider className="my-3" dashed />

                <div className="flex items-center justify-between  text-base">
                  <div className="flex items-center gap-2 font-medium text-base text-[#1b3c74]">
                    <RiServiceLine />
                    <span>Dịch vụ:</span>
                  </div>

                  <span className="text-[rgb(60,66,83)] ">Khám dịch vụ</span>
                </div>

                <Divider className="my-3" dashed />

                <div className="flex items-center justify-between  text-base">
                  <div className="flex items-center gap-2 font-medium text-base text-[#1b3c74]">
                    <LiaWalletSolid />
                    <span>Tiền khám:</span>
                  </div>

                  <span className="text-[rgb(60,66,83)]  font-medium">
                    {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
                  </span>
                </div>
              </div>
              <Divider className="my-6 mb-5" />
              <div>
                <div className="flex items-center justify-between text-base ">
                  <span className="text-gray-800 ">Tổng tiền khám:</span>
                  <span className="text-[rgb(60,66,83)] ">
                    {" "}
                    {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
                  </span>
                </div>
                <div className="flex items-center justify-between text-base mt-2">
                  <span className="text-gray-800 ">Phí tiện ích:</span>0 vnđ
                </div>
                <div className="flex items-center justify-between text-base mt-2">
                  <span className="text-gray-800 font-medium">Tổng cộng:</span>
                  <span className="text-[rgb(60,66,83)] font-medium">
                    {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 mt-6 flex justify-end gap-4 py-5">
            <Button onClick={previous} size="md" color="default">
              Trở lại
            </Button>
            <Button
              color={method ? "primary" : "default"}
              onClick={submitForm}
              size="md"
              isDisabled={!method}
              className={
                method ? "cursor-pointer" : "cursor-default select-none"
              }
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}
