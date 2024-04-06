"use client";

import { PAYMENT_VNPAY_RETURN } from "@/api-services/constant-api";
import { paymentApi } from "@/api-services/payment-api";
import { Booking } from "@/models";
import { ResData } from "@/types";
import { Button, ButtonGroup } from "@nextui-org/button";
import { Result, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import useSWR from "swr";
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import Link from "next/link";
let querystring = require("qs");
const { Paragraph, Text } = Typography;
export interface ResultBookingPageProps {}

export default function ResultBookingPage(props: ResultBookingPageProps) {
  const searchParams = useSearchParams();

  const vnp_TmnCode = searchParams.get("vnp_TmnCode");
  const vnp_Amount = searchParams.get("vnp_Amount");
  const vnp_BankCode = searchParams.get("vnp_BankCode");
  const vnp_BankTranNo = searchParams.get("vnp_BankTranNo");
  const vnp_CardType = searchParams.get("vnp_CardType");
  const vnp_OrderInfo = searchParams.get("vnp_OrderInfo");
  const vnp_PayDate = searchParams.get("vnp_PayDate");
  const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
  const vnp_TransactionNo = searchParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = searchParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = searchParams.get("vnp_TxnRef");
  const vnp_SecureHash = searchParams.get("vnp_SecureHash");

  var signData = querystring.stringify(
    {
      vnp_TmnCode,
      vnp_Amount,
      vnp_BankCode,
      vnp_BankTranNo,
      vnp_CardType,
      vnp_OrderInfo,
      vnp_PayDate,
      vnp_ResponseCode,
      vnp_TransactionNo,
      vnp_TransactionStatus,
      vnp_TxnRef,
      vnp_SecureHash,
    },
    { encode: false }
  );
  const { data, error: error } = useSWR<Booking>(
    `${PAYMENT_VNPAY_RETURN}?${signData}`
  );
  console.log("data", data);
  console.log("error", error);

  return (
    <>
      {!error ? (
        <Result
          status="success"
          title={"Thanh toán thành công"}
          subTitle={
            <div>
              <div>{`Mã lịch hẹn: ${
                data?.id
              } | Số tiền: ${data?.doctorPrice?.toLocaleString()} vnđ | Ngày đặt: ${moment(
                data?.createdAt
              ).format("lll")}`}</div>

              <span>{data?.HealthExaminationSchedule?.TimeCode?.value}</span>
            </div>
          }
          extra={[
            <Button color="primary">Xem lịch đặt</Button>,
            <Button key="buy">Đặt lịch hẹn khác</Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title={error?.msg}
          subTitle="Làm ơn kiểm tra lại thông tin thanh toán."
          extra={[
            <Link href="/">
              <Button color="primary">Về trang chủ</Button>
            </Link>,
            <Button key="buy">Thử mua lại</Button>,
          ]}
        >
          <div className="desc">
            <Paragraph>
              <Text
                strong
                style={{
                  fontSize: 16,
                }}
              >
                Nội dung bạn gửi có lỗi sau:
              </Text>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" /> Dữ
              liệu đã bị thay đổi hay bị lộ thông tin.{" "}
              <a>Thaw immediately &gt;</a>
            </Paragraph>
            <Paragraph>
              <CloseCircleOutlined className="site-result-demo-error-icon" />{" "}
              Tài khoản của bạn đang bị nghi ngờ tấn công website.{" "}
              <a>Apply Unlock &gt;</a>
            </Paragraph>
          </div>
        </Result>
      )}
    </>
  );
}
