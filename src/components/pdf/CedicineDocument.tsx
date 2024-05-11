"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Canvas,
  Svg,
} from "@react-pdf/renderer";
import logo from "../../assets/images/logi_y_te.png";
import qr from "../../assets/images/qr1.png";
import {
  Booking,
  Cedicine,
  HealthRecord,
  PrescriptionDetail,
  ServiceDetails,
} from "@/models";
import {} from "@/untils/common";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGetAddress } from "@/hooks/use-get-address-from-code";

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    padding: "16px 24px",
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  itemStart: {
    alignItems: "flex-start",
  },
  maxw60: {
    maxWidth: "140px",
  },
  header_top: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  text_16: {
    fontSize: "16px",
    color: "#000",
  },
  text_14: {
    fontSize: "14px",
    color: "gray",
  },
  text_center: {
    textAlign: "center",
  },
  title_base: {
    fontSize: "10px",
    color: "#000",
  },
  title_base_gray: {
    fontSize: "10px",
    color: "#555",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
  qr: {
    width: "260px",
    height: "40px",
  },
  wrap_logo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  title_table: {
    fontSize: 10,
    marginBottom: 8,
    color: "#000",
    textDecoration: "underline",
    // fontStyle: "italic",
    fontWeight: "bold",
  },
  wrap_left: {
    width: "60%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  flex_align_start: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  between: {
    justifyContent: "space-between",
    gap: 8,
  },
  max_35_percent: {
    maxWidth: "35%",
  },
  my_4: {
    margin: "4px 0",
  },
  my_8: {
    margin: "8px 0",
  },
  i: {
    // fontStyle: "italic",
  },
  mb_8: {
    margin: "0 0 8px 0",
  },
  mr_8: {
    margin: "0 8px 0px 0",
  },
  mr_16: {
    margin: "0 16px 0px 0",
  },
  my_12: {
    margin: "12px 0",
  },
  wrap_right: {
    width: "40%",
  },
  flex: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexDirection: "row",
  },
  flex_col: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "column",
    gap: 2,
  },
  flex_row_center: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  gap_16: {
    gap: 16,
  },
  gap_10: {
    gap: 10,
  },
  w_50: {
    width: "50%",
  },
  table: {
    margin: "12px 0",
    width: "100%",
    // borderRadius: 4,
    border: "1px solid #000",
    borderTop: "none",
    borderBottom: "none",
  },
  data: {
    fontSize: 10,
    margin: "0 0 12px 0",
  },
  px_8: {
    margin: "4px 8px",
  },
  bold: {
    fontWeight: "bold",
  },
});

interface CedicineDocumentProps {
  dataBooking: Booking | undefined;
  healthRecord: HealthRecord | undefined;
  prescriptionDetail: PrescriptionDetail[] | undefined;
}

const CedicineDocument = ({
  dataBooking,
  prescriptionDetail,
  healthRecord,
}: CedicineDocumentProps) => {
  const [address, setAddress] = useState<string>("");
  useEffect(() => {
    useGetAddress({
      wardCode: healthRecord?.Patient?.addressCode[0] || "",
      districtCode: healthRecord?.Patient?.addressCode[1] || "",
      provinceCode: healthRecord?.Patient?.addressCode[2] || "",
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [
    healthRecord?.Patient?.addressCode[0],
    healthRecord?.Patient?.addressCode[1],
    healthRecord?.Patient?.addressCode[2],
  ]);

  const [addressH, setAddressH] = useState<string>("");
  useEffect(() => {
    useGetAddress({
      wardCode:
        dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
          ?.addressCode?.[0] || "",
      districtCode:
        dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
          ?.addressCode?.[1] || "",
      provinceCode:
        dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
          ?.addressCode?.[2] || "",
    })
      .then((ob) => setAddressH(ob.address))
      .catch((e) => "");
  }, [
    dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
      ?.addressCode?.[0],
    dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
      ?.addressCode?.[1],
    dataBooking?.HealthExaminationSchedule?.Working?.HealthFacility
      ?.addressCode?.[2],
  ]);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View>
          {/* header_top */}
          <View style={s.header_top}>
            <View style={s.wrap_left}>
              <View>
                <View style={s.wrap_logo}>
                  {/* icon */}
                  {/* <View style={s.logo} /> */}
                  <Image style={s.logo} src={logo.src} />
                  <Text style={s.title_base_gray}>BOOKING CARE</Text>
                </View>
              </View>

              <View>
                {/* info */}
                <View>
                  <Text style={s.title_base}>
                    {
                      dataBooking?.HealthExaminationSchedule?.Working
                        ?.HealthFacility?.name
                    }
                  </Text>
                  <View style={{ ...s.flex, ...s.itemStart }}>
                    <Text style={s.title_base_gray}>Địa chỉ: </Text>
                    <Text style={{ ...s.title_base, ...s.maxw60 }}>
                      {addressH}
                    </Text>
                  </View>
                  <View style={s.flex}>
                    <Text style={s.title_base_gray}>Điện thoại: </Text>
                    <Text style={s.title_base}>
                      {
                        dataBooking?.HealthExaminationSchedule?.Working
                          ?.HealthFacility?.phone
                      }
                    </Text>
                  </View>
                  <View style={s.flex}>
                    <Text style={s.title_base_gray}>Email: </Text>
                    <Text style={s.title_base}>
                      {
                        dataBooking?.HealthExaminationSchedule?.Working
                          ?.HealthFacility?.email
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ ...s.wrap_right, ...s.flex_row_center }}>
              <View style={s.flex_col}>
                <Image style={s.qr} src={qr.src} />

                <View style={s.flex}>
                  <Text style={s.title_base_gray}></Text>
                  <Text style={s.title_base}>{healthRecord?.id}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ ...s.my_8 }}>
            <View style={{ ...s.flex_row_center }}>
              <Text style={{ ...s.text_16 }}>TOA THUỐC</Text>
            </View>
            <View style={{ ...s.my_8 }}>
              <View style={{ ...s.flex, ...s.gap_16 }}>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>Tên bệnh nhân: </Text>
                  <Text style={s.title_base}>
                    {healthRecord?.Patient?.fullName}
                  </Text>
                </View>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>Giới tính: </Text>
                  <Text style={s.title_base}>
                    {healthRecord?.Patient?.gender == "male" ? "Nam" : "Nu"}
                  </Text>
                </View>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>Ngày sinh: </Text>
                  <Text style={s.title_base}>
                    {moment(healthRecord?.Patient?.birthDay).format("L")}
                  </Text>
                </View>
              </View>
              <View style={s.flex}>
                <Text style={s.title_base_gray}>Đối tượng: </Text>
                <Text style={s.title_base}>Dịch vụ</Text>
              </View>
              <View style={s.flex}>
                <Text style={s.title_base_gray}>Địa chỉ: </Text>
                <Text style={s.title_base}>{address}</Text>
              </View>
              <View style={s.flex}>
                <Text style={s.title_base_gray}>Chuẩn đoán: </Text>
                <Text style={s.title_base}>{healthRecord?.diagnosis}</Text>
              </View>
            </View>
            <Text style={s.title_table}>Chỉ định dùng thuốc:</Text>

            {/* row*/}
            {prescriptionDetail?.map((d, i) => (
              <View style={s.data} key={d.id} wrap={false}>
                <View style={{ ...s.flex, ...s.mb_8, ...s.between }}>
                  <Text style={s.bold}>
                    {i + 1}. {d?.Cedicine.name}
                  </Text>
                  <Text>
                    {d?.quantity.toString() +
                      (d?.unit == "v" ? " viên" : " hộp")}
                  </Text>
                </View>
                <View style={{ ...s.flex, ...s.mb_8 }}>
                  <View style={{ ...s.flex, ...s.mr_16 }}>
                    <Text style={{ ...s.i, ...s.mr_8 }}>Sáng:</Text>
                    <Text> {d?.morning.toString()}</Text>
                  </View>
                  <View style={{ ...s.flex, ...s.mr_16 }}>
                    <Text style={{ ...s.i, ...s.mr_8 }}>Trưa:</Text>
                    <Text> {d?.noon.toString()}</Text>
                  </View>
                  <View style={{ ...s.flex, ...s.mr_16 }}>
                    <Text style={{ ...s.i, ...s.mr_8 }}>Chiều:</Text>
                    <Text> {d?.afterNoon.toString()}</Text>
                  </View>
                  <View style={{ ...s.flex }}>
                    <Text style={{ ...s.i, ...s.mr_8 }}>Tối:</Text>
                    <Text> {d?.evening.toString()}</Text>
                  </View>
                </View>

                <Text style={{ ...s.title_base }}>Cách dùng: {d?.usage}</Text>
              </View>
            ))}

            {/* footer */}
            <View style={{ ...s.flex_align_start, ...s.between, ...s.my_12 }}>
              {/* 60 */}
              <View style={{ ...s.max_35_percent }}>
                <Text style={s.title_base_gray}>Ghi Chú: </Text>
                <Text style={{ ...s.title_base }}>
                  - Vui lòng kiểm tra thông tin toa thuốc
                </Text>
              </View>
              {/* 40 */}
              <View style={{ ...s.w_50 }}>
                <View style={{ ...s.flex_col, ...s.gap_10 }}>
                  <Text style={{ ...s.title_base }}>
                    ...,{" "}
                    {moment(prescriptionDetail?.[0]?.createdAt)
                      .locale("vi")
                      .format("LL")}
                  </Text>
                  <Text style={{ ...s.title_base }}>Bác sĩ khám bệnh</Text>
                  <Text style={{ ...s.title_base }}>
                    {
                      dataBooking?.HealthExaminationSchedule?.Working?.Staff
                        ?.fullName
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CedicineDocument;
