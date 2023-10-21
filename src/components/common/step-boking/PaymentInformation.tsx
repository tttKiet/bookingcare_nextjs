"use client";

import { userApi } from "@/api-services";
import { ColorBox } from "@/components/box";
import { ModalPositionHere } from "@/components/modal";
import {
  Booking,
  HealthExaminationSchedule,
  PatientProfile,
  WorkRoom,
} from "@/models";
import { Button, Divider, Form, Radio, RadioChangeEvent } from "antd";
import * as React from "react";
import toast from "react-hot-toast";
import { BsCreditCard2Back } from "react-icons/bs";
import { IoBagAddOutline } from "react-icons/io5";
import { LiaWalletSolid } from "react-icons/lia";
import { RiServiceLine } from "react-icons/ri";

export interface IPaymentInformation {
  schedule: Partial<HealthExaminationSchedule> | null;
  patientProfile: PatientProfile | null;
  checkupInfo: WorkRoom | null;
  previous: () => void;
  confirmSuccess: () => Promise<void>;
}

export function PaymentInformation({
  schedule,
  patientProfile,
  previous,
  checkupInfo,
  confirmSuccess,
}: IPaymentInformation) {
  const methodPayment = React.useMemo(
    () => ({
      PAY_AT_HEALTH_FACILITY: "Thanh toán tại bệnh viện",
      MOMO: "Thanh toán bằng ví Momo",
    }),
    []
  );
  type MethodKeys = keyof typeof methodPayment;
  const [method, setMothod] = React.useState<MethodKeys | null>(null);
  const [showPaymentModal, setShowPaymentModal] =
    React.useState<boolean>(false);

  function toggleShowPaymentModal() {
    setShowPaymentModal((s) => !s);
  }
  function handleClickPayment() {}
  const [form] = Form.useForm();

  function onChangeMethod(e: RadioChangeEvent): void {
    setMothod(e.target.value);
  }
  const [isLoading, setIsloading] = React.useState<boolean>(false);
  async function handleClickAgreePayment() {
    const promisePaymentFake = new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    setIsloading(true);
    promisePaymentFake
      .then(() => {
        confirmSuccess();
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
              <span className="font-medium">
                {method && methodPayment?.[method].split("Thanh toán ")[1]}
              </span>
            </div>
            <div className="mt-4 px-4 py-2 rounded-md bg-blue-100 text-gray-700 shadow">
              Bạn sẽ nhận được phiếu khám bệnh ngay khi thanh toán thành công.
              Trường hợp không nhận được phiếu khám bệnh, vui lòng liên hệ
              19002115.
            </div>
            <div className="flex justify-end gap-4 py-5">
              <Button type="dashed" onClick={toggleShowPaymentModal}>
                Trở lại
              </Button>
              <Button
                type={"primary"}
                loading={isLoading}
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
                  <div className="flex justify-start flex-col text-base">
                    <Radio value={"PAY_AT_HEALTH_FACILITY"}>
                      <span className="text-base">
                        {methodPayment.PAY_AT_HEALTH_FACILITY}
                      </span>
                    </Radio>
                    <Radio className="text-base" value={"MOMO"}>
                      <span className="text-base">{methodPayment.MOMO}</span>
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
              <Button type="dashed" onClick={previous}>
                Trở lại
              </Button>
              <Button
                htmlType="submit"
                type={method ? "primary" : "dashed"}
                disabled={!method}
                onClick={handleClickPayment}
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
