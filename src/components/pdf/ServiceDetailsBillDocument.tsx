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
import { Booking, HealthRecord, ServiceDetails } from "@/models";
import { textNomo } from "@/untils/common";
import moment from "moment";
import { useEffect, useState } from "react";
import { useGetAddress } from "@/hooks/use-get-address-from-code";

Font.register({
  family: "Poppins",
  src: "http://fonts.gstatic.com/s/poppins/v1/TDTjCH39JjVycIF24TlO-Q.ttf",
});
const s = StyleSheet.create({
  page: {
    fontFamily: "Poppins",
    padding: "16px 24px",
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
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
  row: {
    display: "flex",
    flexDirection: "row",
    // padding: "0 8px",
    color: "#555",
    fontSize: 12,
    textAlign: "left",
    borderBottom: "1px solid #000",
  },
  px_8: {
    margin: "4px 8px",
  },
  row1: {
    width: "30%",
    borderRight: "1px solid #000",
  },
  row2: {
    width: "20%",
    borderRight: "1px solid #000",
  },
  row3: {
    width: "20%",
    borderRight: "1px solid #000",
  },
  row4: {
    width: "30%",
  },

  header: {
    color: "#000",
    fontSize: 10,
    fontWeight: 500,
    border: "1px solid #000",
    borderLeft: "none",
    borderRight: "none",
  },
  bold: {
    fontWeight: "bold",
  },
});

interface ServiceDetailsBillDocumentProps {
  dataServiceDetails: ServiceDetails[] | undefined;
  dataBooking: Booking | undefined;
  healthRecord: HealthRecord | undefined;
}

const ServiceDetailsBillDocument = ({
  dataBooking,
  dataServiceDetails,
  healthRecord,
}: ServiceDetailsBillDocumentProps) => {
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
                    {textNomo(
                      dataBooking?.HealthExaminationSchedule?.Working
                        ?.HealthFacility?.name
                    )}
                  </Text>
                  <View style={s.flex}>
                    <Text style={s.title_base_gray}>Dia Chi: </Text>
                    <Text style={s.title_base}>
                      {textNomo(
                        dataBooking?.HealthExaminationSchedule?.Working
                          ?.HealthFacility?.address
                      )}
                    </Text>
                  </View>
                  <View style={s.flex}>
                    <Text style={s.title_base_gray}>Dien thoai: </Text>
                    <Text style={s.title_base}>
                      {textNomo(
                        dataBooking?.HealthExaminationSchedule?.Working
                          ?.HealthFacility?.phone
                      )}
                    </Text>
                  </View>
                  <View style={s.flex}>
                    <Text style={s.title_base_gray}>Email: </Text>
                    <Text style={s.title_base}>
                      {textNomo(
                        dataBooking?.HealthExaminationSchedule?.Working
                          ?.HealthFacility?.email
                      )}
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
              <Text style={{ ...s.text_16 }}>HOA DON DICH VU</Text>
            </View>
            <View style={{ ...s.my_8 }}>
              <View style={{ ...s.flex, ...s.gap_16 }}>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>TEN BENH NHAN: </Text>
                  <Text style={s.title_base}>
                    {textNomo(healthRecord?.Patient?.fullName)}
                  </Text>
                </View>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>Gioi tinh: </Text>
                  <Text style={s.title_base}>
                    {healthRecord?.Patient?.gender == "male" ? "Nam" : "Nu"}
                  </Text>
                </View>
                <View style={s.flex}>
                  <Text style={s.title_base_gray}>NGAY SINH: </Text>
                  <Text style={s.title_base}>
                    {moment(healthRecord?.Patient?.birthDay).format("L")}
                  </Text>
                </View>
              </View>
              <View style={s.flex}>
                <Text style={s.title_base_gray}>Doi tuong: </Text>
                <Text style={s.title_base}>Dich vu</Text>
              </View>
              <View style={s.flex}>
                <Text style={s.title_base_gray}>Dia chi: </Text>
                <Text style={s.title_base}>{textNomo(address)}</Text>
              </View>
            </View>

            {/* TABLE */}
            <View style={s.table}>
              <View style={[s.row, s.bold, s.header]}>
                <View style={s.row1}>
                  <Text style={s.px_8}>TEN DICH VU</Text>
                </View>
                <View style={s.row2}>
                  <Text style={s.px_8}>SO LUONG</Text>
                </View>
                <View style={s.row3}>
                  <Text style={s.px_8}>DON GIA</Text>
                </View>
                <View style={s.row4}>
                  <Text style={s.px_8}>GHI CHU</Text>
                </View>
              </View>
              {/* row*/}
              {dataServiceDetails?.map((d) => (
                <View style={s.row} key={d.id} wrap={false}>
                  <View style={s.row1}>
                    <Text style={s.px_8}>
                      {textNomo(d?.HospitalService?.ExaminationService?.name)}
                    </Text>
                  </View>
                  <View style={s.row2}>
                    <Text style={s.px_8}>1 lan</Text>
                  </View>
                  <View style={s.row3}>
                    <Text style={s.px_8}>
                      {textNomo(d?.HospitalService?.price.toLocaleString())}
                    </Text>
                  </View>
                  <View style={s.row4}>
                    <Text style={s.px_8}></Text>
                  </View>
                </View>
              ))}
            </View>

            {/* footer */}
            <View style={{ ...s.flex_align_start, ...s.between, ...s.my_12 }}>
              {/* 60 */}
              <View style={{ ...s.max_35_percent }}>
                <Text style={s.title_base_gray}>Ghi chu: </Text>
                <Text style={{ ...s.title_base }}>
                  - Vui long kiem tra thong tin truoc khi dung dich vu.
                </Text>
              </View>
              {/* 40 */}
              <View style={{ ...s.w_50 }}>
                <View style={{ ...s.flex_col, ...s.gap_10 }}>
                  <Text style={{ ...s.title_base }}>
                    ...,{" "}
                    {textNomo(
                      moment(dataServiceDetails?.[0].createdAt)
                        .locale("vi")
                        .format("LL")
                    )}
                  </Text>
                  <Text style={{ ...s.title_base }}>BAC SI KHAM BENH</Text>
                  <Text style={{ ...s.title_base }}>
                    {textNomo(
                      dataBooking?.HealthExaminationSchedule?.Working?.Staff
                        ?.fullName
                    )}
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

export default ServiceDetailsBillDocument;
