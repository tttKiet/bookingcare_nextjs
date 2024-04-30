"use client";

import {
  API_DOCTOR_BOOKING,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SERVICE_DETAILS,
  API_USER_MEDICAL_RECORD,
} from "@/api-services/constant-api";
import {
  Booking,
  HealthRecord,
  PrescriptionDetail,
  ResBookingAndHealthRecord,
  ResPaginationMedicalRecord,
  ServiceDetails,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { Timeline } from "antd";
import { useContext, useMemo, useState } from "react";
import useSWR, { BareFetcher } from "swr";
import { InfoCheckUpContext } from "../admin-box/CheckUpDetails";
import instances from "@/axios";
import moment from "moment";
import {
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { ActionBox } from "../box";
import { EyeActionBox } from "../box/EyeActionBox.";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import { FaCode, FaRegFilePdf } from "react-icons/fa";
import { CiCalendarDate, CiUser } from "react-icons/ci";
import { TbClockHour2 } from "react-icons/tb";
import { MdOutlineDescription } from "react-icons/md";
import { PDFViewer } from "@react-pdf/renderer";
import ServiceDetailsBillDocument from "../pdf/ServiceDetailsBillDocument";
import CedicineDocument from "../pdf/CedicineDocument";
import TableServiceDetails from "./TableServiceDetails";
import TablePrescriptionDetails from "./TablePrescriptionDetails";

export interface IMediCalRecordUserProps {}

export default function MediCalRecordUser(props: IMediCalRecordUserProps) {
  //get cccd
  const { bookingId } = useContext(InfoCheckUpContext);
  const { data: bookingContext, mutate } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${bookingId}`);

  // modal
  const [healthRecordView, setHealthRecordView] = useState<
    HealthRecord | undefined
  >();

  const { data: dataServiceDetails, mutate: mutateServiceDetails } = useSWR<
    ServiceDetails[]
  >(`${API_DOCTOR_SERVICE_DETAILS}?healthRecordId=${healthRecordView?.id}`);

  const { data: dataPrescriptionDetail, mutate: mutatePrescriptionDetail } =
    useSWR<PrescriptionDetail[]>(
      `${API_DOCTOR_PRESCRIPTION_DETAILS}?healthRecordId=${healthRecordView?.id}`
    );

  const fetcher: BareFetcher<ResPaginationMedicalRecord> = async ([
    url,
    token,
  ]) =>
    (
      await instances.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const { data: responseMedicalRecord, mutate: mutateMedicalRecord } =
    useSWR<ResPaginationMedicalRecord>(
      `${API_USER_MEDICAL_RECORD}?cccd=${bookingContext?.rows?.[0]?.healthRecord?.Patient?.cccd}`
    );

  // state
  const { isOpen, onOpen, onClose } = useDisclosure({ id: "view" });
  const {
    isOpen: isOpenPdf,
    onOpen: onOpenPdf,
    onClose: onClosePdf,
  } = useDisclosure({ id: "view-pdf" });

  function onClickView(r: HealthRecord) {
    setHealthRecordView(r);
    onOpen();
  }

  const [BodyPdf, setBodyDdf] = useState<JSX.Element>(<div></div>);
  function clickPdf(type: "service" | "cedicine") {
    console.log(
      "dataPrescriptionDetail  -- - -dataPrescriptionDetail",
      dataPrescriptionDetail
    );
    if (type == "service") {
      const Body = (
        <PDFViewer
          // onClick={handlePrintService}
          className="w-full h-full"
        >
          <ServiceDetailsBillDocument
            dataBooking={healthRecordView?.Booking}
            dataServiceDetails={dataServiceDetails}
            healthRecord={healthRecordView}
          />
        </PDFViewer>
      );
      setBodyDdf(Body);
    } else if (type == "cedicine") {
      const Body = (
        <PDFViewer
          // onClick={handlePrintService}
          className="w-full h-full"
        >
          <CedicineDocument
            dataBooking={healthRecordView?.Booking}
            prescriptionDetail={dataPrescriptionDetail}
            healthRecord={healthRecordView}
          />
        </PDFViewer>
      );
      setBodyDdf(Body);
    }

    onOpenPdf();
  }

  // class
  const boxClass = "md:col-span-3 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600 font-medium";
  const footerClass = "mt-4 flex item-center justify-end";
  const labelHeading = "gr-title-admin mb-4 flex items-center gap-2";
  return (
    <div className="box-white">
      <ModalFadeInNextUi
        backdrop="opaque"
        id="view"
        size="5xl"
        show={isOpen}
        title="Xem bệnh án ngày"
        toggle={onClose}
        showBtnCancel={false}
        contentBtnSubmit="Thoát"
        handleSubmit={onClose}
        body={
          <div>
            <div>
              <h3 className="my-2 mb-4 text-black text-sm font-medium flex items-center gap-2 justify-between">
                THÔNG TIN Bác sĩ VÀ NƠI KHÁM
              </h3>
              <div className="grid grid-cols-12 gap-4">
                <div className={`md:col-span-4 grid-cols-12 `}>
                  <Input
                    size="lg"
                    isReadOnly
                    variant="bordered"
                    label={
                      <div className="flex items-center gap-1">
                        <FaCode />
                        Bác sĩ
                      </div>
                    }
                    className={`${descClass} `}
                    value={
                      healthRecordView?.Booking?.HealthExaminationSchedule
                        ?.Working?.Staff?.fullName
                    }
                  />
                </div>
                <div className={"md:col-span-4 grid-cols-12 "}>
                  <Input
                    size="lg"
                    variant="bordered"
                    isReadOnly
                    label={
                      <div className="flex items-center gap-1">
                        <CiUser />
                        Cơ sở y tế
                      </div>
                    }
                    className={`${descClass} font-medium`}
                    value={
                      healthRecordView?.Booking?.HealthExaminationSchedule
                        ?.Working?.HealthFacility?.name
                    }
                  />
                </div>
                <div className="md:col-span-2 grid-cols-12 ">
                  <Input
                    size="lg"
                    variant="bordered"
                    isReadOnly
                    label={
                      <div className="flex items-center gap-1">
                        <CiCalendarDate />
                        Ngày khám
                      </div>
                    }
                    className={`${descClass} font-medium`}
                    value={moment(
                      healthRecordView?.Booking?.HealthExaminationSchedule?.date
                    ).format("L")}
                  />
                </div>
                <div className={"md:col-span-2 grid-cols-12 "}>
                  <Input
                    size="lg"
                    variant="bordered"
                    isReadOnly
                    label={
                      <div className="flex items-center gap-1">
                        <TbClockHour2 />
                        Khung giờ
                      </div>
                    }
                    className={`${descClass}`}
                    value={
                      healthRecordView?.Booking?.HealthExaminationSchedule
                        ?.TimeCode?.value
                    }
                  />
                </div>

                <div className="md:col-span-6 grid-cols-12 ">
                  <Textarea
                    size="lg"
                    variant="bordered"
                    isReadOnly
                    classNames={{
                      label: "text-base",
                    }}
                    label={
                      <div className="flex items-center gap-1">
                        <MdOutlineDescription />
                        Chuẩn đoán bệnh
                      </div>
                    }
                    className={`${descClass}`}
                    value={healthRecordView?.diagnosis}
                  />
                </div>
                <div className="md:col-span-6 grid-cols-12 ">
                  <Textarea
                    size="lg"
                    variant="bordered"
                    isReadOnly
                    classNames={{
                      label: "text-base",
                    }}
                    label={
                      <div className="flex items-center gap-1">
                        <MdOutlineDescription />
                        Dặn dò của Bác sĩ
                      </div>
                    }
                    className={`${descClass}`}
                    value={healthRecordView?.note}
                  />
                </div>
              </div>
            </div>
            <Divider className="my-12" />
            <div>
              <h3
                className="my-2 mb-4 text-black text-sm font-medium
               flex items-center gap-2"
              >
                CÁC DỊCH VỤ ĐÃ DÙNG
                {(dataServiceDetails?.length || -1) > 0 && (
                  <span
                    onClick={() => clickPdf("service")}
                    className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                  >
                    <FaRegFilePdf className="w-5 h-5" />
                  </span>
                )}
              </h3>
              <div className="grid col-span-12 gap-4">
                {dataServiceDetails && dataServiceDetails?.length > 0 ? (
                  <TableServiceDetails
                    isReadOnly={true}
                    data={dataServiceDetails}
                  />
                ) : (
                  <div>./</div>
                )}
              </div>
            </div>
            <div>
              <h3
                className="my-2 mb-4 text-black text-sm font-medium
               flex items-center gap-2"
              >
                TOA THUỐC
                {(dataPrescriptionDetail?.length || -1) > 0 && (
                  <span
                    onClick={() => clickPdf("cedicine")}
                    className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                  >
                    <FaRegFilePdf className="w-5 h-5" />
                  </span>
                )}
              </h3>
              <div className="grid col-span-12 gap-4">
                {dataPrescriptionDetail &&
                dataPrescriptionDetail?.length > 0 ? (
                  <TablePrescriptionDetails
                    isReadOnly={true}
                    data={dataPrescriptionDetail}
                  />
                ) : (
                  <div>./</div>
                )}
              </div>
            </div>
          </div>
        }
      />

      {/* pdf */}
      <Modal size={"full"} isOpen={isOpenPdf} onClose={onClosePdf}>
        <ModalContent>
          {(onClosePdf) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">PDF</ModalHeader> */}
              <ModalBody>
                <div className="w-full min-h-screen px-6 py-2">{BodyPdf}</div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex items-center justify-center w-full pt-6">
        <Timeline mode="alternate" className="w-full">
          {responseMedicalRecord?.rows.map((r: HealthRecord) => (
            <Timeline.Item>
              <div>
                <div>
                  <span className="font-medium text-[#1b3c74] flex items-center gap-2">
                    {moment(r?.Booking?.HealthExaminationSchedule?.date).format(
                      "L"
                    )}

                    <EyeActionBox
                      onClick={() => {
                        onClickView(r);
                      }}
                      iconColor="#1b3c74"
                    />
                  </span>
                </div>

                <div className="text-[rgb(60,66,83)]/90">
                  Chuân đoán: {r?.diagnosis}
                </div>
                <div className="text-[rgb(60,66,83)]/90">
                  Bác sĩ khám:{" "}
                  {
                    r?.Booking?.HealthExaminationSchedule?.Working?.Staff
                      ?.fullName
                  }
                </div>
                <div className="text-[rgb(60,66,83)]/90">
                  Cơ sở y tế:{" "}
                  {
                    r?.Booking?.HealthExaminationSchedule?.Working
                      ?.HealthFacility?.name
                  }
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
