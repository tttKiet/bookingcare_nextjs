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
import { Divider, Form, Radio, RadioChangeEvent } from "antd";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BsCreditCard2Back } from "react-icons/bs";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaWalletSolid } from "react-icons/lia";
import { RiServiceLine } from "react-icons/ri";
import vnpay_logo from "../../../assets/images/logo-vi-vnpay.png";
import Image from "next/image";
import { FaRegHospital } from "react-icons/fa";

export interface IPaymentInformation {
  schedule: Partial<HealthExaminationSchedule> | null;
  patientProfile: PatientProfile | null;
  checkupInfo: WorkRoom | null;
  previous: () => void;
  confirmSuccess: ({ paymentType }: { paymentType: string }) => Promise<void>;
}

export function PaymentInformation({
  schedule,
  patientProfile,
  previous,
  checkupInfo,
  confirmSuccess,
}: IPaymentInformation) {
  const methodPayment = useMemo(
    () => ({
      hospital: "Thanh toán tại bệnh viện",
      card: "Thanh toán bằng VNPAY",
    }),
    []
  );
  type MethodKeys = keyof typeof methodPayment;
  const [method, setMothod] = useState<MethodKeys | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);

  function toggleShowPaymentModal() {
    setShowPaymentModal((s) => !s);
  }

  const [form] = Form.useForm();

  function onChangeMethod(e: RadioChangeEvent): void {
    setMothod(e.target.value);
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
                {method && methodPayment?.[method].split("Thanh toán ")[1]}
              </span>
            </div>
            <div className="mt-4 px-4 py-2 rounded-md bg-blue-100 text-gray-700 shadow">
              Bạn sẽ nhận được phiếu khám bệnh ngay khi thanh toán thành công.
              Trường hợp không nhận được phiếu khám bệnh, vui lòng liên hệ
              19002115.
            </div>
            <div className="flex justify-end gap-4 pt-6">
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
        config={{
          centered: true,
        }}
        title="Xác nhận thanh toán"
        toggle={toggleShowPaymentModal}
        footer={false}
        show={showPaymentModal}
      />
      <ColorBox title="Chọn phương thức thanh toán" className="">
        <Form form={form} onFinish={submitForm}>
          <div className="grid grid-cols-12 pt-3">
            <div className="col-span-12 md:col-span-6 text-left">
              <Form.Item
                name="pay_method"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn phương thức thanh toán.",
                  },
                ]}
              >
                <Radio.Group
                  onChange={onChangeMethod}
                  value={method}
                  size="large"
                >
                  <div className="flex justify-start flex-col text-base gap-4">
                    <Radio value={"hospital"}>
                      <span className="text-base flex items-center justify-start gap-2">
                        {methodPayment.hospital}
                        <FaRegHospital size={26} />
                      </span>
                    </Radio>
                    <Radio className="text-base" value={"card"}>
                      <span className="text-base flex items-center justify-start gap-2">
                        {methodPayment.card}
                        <Image
                          src={vnpay_logo}
                          alt="VNPAY"
                          width={60}
                          height={60}
                        />
                      </span>
                    </Radio>
                  </div>
                </Radio.Group>
              </Form.Item>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div>
                <h6 className="flex items-center gap-2 text-lg text-blue-600 pb-3">
                  <BsCreditCard2Back />
                  Thông tin thanh toán
                </h6>
                <div className="rounded-md border shadow px-6 py-4">
                  <div className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2 font-medium text-base text-gray-700">
                      <IoBagAddOutline />
                      <span className="text-gray-800 ">Chuyên khoa:</span>
                    </div>

                    <span>{schedule?.Working?.Staff.Specialist.name}</span>
                  </div>
                  <Divider className="my-3" dashed />

                  <div className="flex items-center justify-between  text-base">
                    <div className="flex items-center gap-2 font-medium text-base text-gray-700">
                      <RiServiceLine />
                      <span>Dịch vụ:</span>
                    </div>

                    <span>Khám dịch vụ</span>
                  </div>

                  <Divider className="my-3" dashed />

                  <div className="flex items-center justify-between  text-base">
                    <div className="flex items-center gap-2 font-medium text-base text-gray-700">
                      <LiaWalletSolid />
                      <span>Tiền khám:</span>
                    </div>

                    <span className="text-black font-medium">
                      {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
                    </span>
                  </div>
                </div>
                <Divider className="my-6 mb-5" />
                <div>
                  <div className="flex items-center justify-between text-base ">
                    <span className="text-gray-800 ">Tổng tiền khám:</span>
                    {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
                  </div>
                  <div className="flex items-center justify-between text-base mt-2">
                    <span className="text-gray-800 ">Phí tiện ích:</span>0 vnđ
                  </div>
                  <div className="flex items-center justify-between text-base mt-2">
                    <span className="text-gray-800 font-medium">
                      Tổng cộng:
                    </span>
                    {checkupInfo?.checkUpPrice.toLocaleString()} vnđ
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
      </ColorBox>
    </>
  );
}
