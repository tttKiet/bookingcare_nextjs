import { healthFacilitiesApi, staffApi } from "@/api-services";
import {
  API_ADMIN_MANAGER_SERVICE,
  API_CODE,
  API_DOCTOR_BOOKING,
  API_DOCTOR_HEALTH_RECORD,
  API_DOCTOR_PATIENT,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SERVICE_DETAILS,
} from "@/api-services/constant-api";
import {
  Booking,
  Code,
  HealthRecord,
  HospitalService,
  Patient,
  PrescriptionDetail,
  ResBookingAndHealthRecord,
  ServiceDetails,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { getColorChipCheckUp } from "@/untils/common";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import {
  Autocomplete,
  AutocompleteItem,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import { toast } from "react-toastify";
import useSWR from "swr";
import { InfoCheckUpContext } from "../admin-box/CheckUpDetails";
import BodyPrescriptionDetails from "../body-modal/BodyPrescriptionDetails";
import { AddActionBox } from "../box/AddActionBox";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import CedicineDocument from "../pdf/CedicineDocument";
import ServiceDetailsBillDocument from "../pdf/ServiceDetailsBillDocument";
import ModalUpdateServiceDetails from "./ModalUpdateServiceDetails";
import TablePrescriptionDetails from "./TablePrescriptionDetails";
import TableServiceDetails from "./TableServiceDetails";
import { NotificationIcon } from "../icons/NotificationIcon";
import { FaCode } from "react-icons/fa";
import { CiCalendarDate, CiUser } from "react-icons/ci";
import { TbClockHour2 } from "react-icons/tb";
import { MdOutlineDescription, MdOutlineNoteAlt } from "react-icons/md";
import { LuClipboardSignature } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { IoCheckmarkDoneOutline } from "react-icons/io5";

export interface HealthRecordDetailsProps {}

export default function HealthRecordDetails(props: HealthRecordDetailsProps) {
  const data = useContext(InfoCheckUpContext);
  const { bookingId } = useContext(InfoCheckUpContext);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const [editCodeValue, setEditCodeValue] = useState<string>("");
  const { data: dataBooking, mutate: mutateBooking } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${bookingId}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  const inforBooking: Booking | undefined = useMemo(
    () => dataBooking?.rows?.[0]?.booking,
    [dataBooking]
  );

  const [valueHospitalService, setValueHospitalService] = useState<string>("");
  const [valueServiceDetailsEdit, setValueServiceDetailsEdit] =
    useState<string>("");

  const { data: dataPatient, mutate: mutatePatient } = useSWR<
    ResDataPaginations<Patient>
  >(`${API_DOCTOR_PATIENT}?cccd=${inforBooking?.PatientProfile?.cccd}`);

  const { data: dataHealthRecord, mutate: mutateHealthRecord } = useSWR<
    ResDataPaginations<HealthRecord>
  >(`${API_DOCTOR_HEALTH_RECORD}?booking=${inforBooking?.id}`);
  const inforHealthRecord: HealthRecord | undefined = useMemo(
    () => dataHealthRecord?.rows?.[0],
    [dataHealthRecord]
  );

  const { data: dataHospitalService, mutate: mutateHospitalService } = useSWR<
    ResDataPaginations<HealthRecord>
  >(
    `${API_ADMIN_MANAGER_SERVICE}?healthFacilityId=${inforBooking?.HealthExaminationSchedule?.Working?.healthFacilityId}`
  );

  const { data: codeBooking, mutate: mutateCodeBooking } = useSWR<
    ResDataPaginations<Code>
  >(`${API_CODE}?name=CheckUp`);

  const { data: dataServiceDetails, mutate: mutateServiceDetails } = useSWR<
    ServiceDetails[]
  >(
    `${API_DOCTOR_SERVICE_DETAILS}?healthRecordId=${dataHealthRecord?.rows?.[0]?.id}`
  );

  const { data: dataPrescriptionDetail, mutate: mutatePrescriptionDetail } =
    useSWR<PrescriptionDetail[]>(
      `${API_DOCTOR_PRESCRIPTION_DETAILS}?limit=500&offset=0&healthRecordId=${dataHealthRecord?.rows?.[0]?.id}`
    );

  const optionHospitalServices: { label: string; value: string }[] =
    useMemo(() => {
      return (
        dataHospitalService?.rows?.map((d: HospitalService) => {
          return {
            label: d?.ExaminationService?.name,
            value: d?.id,
          };
        }) || []
      );
    }, [dataHospitalService]);

  useEffect(() => {
    if (inforBooking?.Code?.key) setEditCodeValue(inforBooking?.Code?.key);
  }, [inforBooking?.Code?.key]);

  const [diagnosis, setDiagnosis] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const boxClass = "md:col-span-3 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600 font-medium";
  const footerClass = "mt-4 flex item-center justify-end";
  const labelHeading = "gr-title-admin mb-4 flex items-center gap-2";
  const colorInputStatus = getColorChipCheckUp(inforBooking?.Code?.key);
  const [BodyPdf, setBodyDdf] = useState<JSX.Element>(<div></div>);
  const [obServiceDetailsEdit, setServiceDetailsEdit] = useState<
    ServiceDetails | undefined
  >();
  const [obPrescriptionEdit, setPrescriptionEdit] = useState<
    PrescriptionDetail | undefined
  >();
  const [emailSend, setEmailSend] = useState<string>("");
  useEffect(() => {
    if (inforHealthRecord?.Patient?.email) {
      setEmailSend(inforHealthRecord?.Patient?.email);
    }
  }, [inforHealthRecord?.Patient?.email]);

  const {
    isOpen: isOpenService,
    onOpen: onOpenService,
    onClose: onCloseService,
  } = useDisclosure({ id: "add-service" });
  const {
    isOpen: isOpenEditStatusBooking,
    onOpen: onOpenEditStatusBooking,
    onClose: onCloseEditStatusBooking,
  } = useDisclosure({ id: "add-EditStatusBooking" });
  const {
    isOpen: isOpenConfirmEmailDone,
    onOpen: onOpenConfirmEmailDone,
    onClose: onCloseConfirmEmailDone,
  } = useDisclosure({ id: "cf-enail" });
  const {
    isOpen: isOpenPdf,
    onOpen: onOpenPdf,
    onClose: onClosePdf,
  } = useDisclosure({ id: "view-pdf" });
  const {
    isOpen: isOpenPrescriptionDetails,
    onOpen: onOpenPrescriptionDetails,
    onClose: onClosePrescriptionDetails,
  } = useDisclosure({ id: "add-prescription-details" });
  const {
    isOpen: isOpenConfirm,
    onOpen: onOpenConfirm,
    onClose: onCloseConfirm,
  } = useDisclosure({ id: "tg-Confirm" });
  const {
    isOpen: isOpenConfirmPre,
    onOpen: onOpenConfirmPre,
    onClose: onCloseConfirmPre,
  } = useDisclosure({ id: "tg-Confirm-Pre" });

  const {
    isOpen: isOpenUpdateResult,
    onOpen: onOpenUpdateResult,
    onClose: onCloseUpdateResult,
  } = useDisclosure({ id: "tg-UpdateResult" });

  async function handleClickCreateHealthRecord() {
    if (!inforBooking?.id) {
      return toast.warning("Id lịch hẹn không tìm thấy, vui lòng thử lại");
    } else if (inforBooking?.status == "CU1") {
      return toast.warning("Lịch hẹn chưa được thanh toán!");
    } else if (!dataPatient?.rows?.[0]?.id) {
      return toast.warning(
        "Bệnh nhân chưa được thêm vào cơ sở dữ liệu, hãy tạo bệnh nhân."
      );
    }
    const api = staffApi.craeteHealthRecord({
      bookingId: inforBooking?.id,
      patientId: dataPatient?.rows?.[0]?.id,
    });
    const res = await toastMsgFromPromise(api);

    if (res.statusCode === 0 || res.statusCode === 200) {
      mutateHealthRecord();
    }
  }

  async function handleDeleteServiceDetails() {
    const api = staffApi.deleteServiceDetails(valueServiceDetailsEdit);
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateServiceDetails();
    }
    setValueServiceDetailsEdit("");
    setValueHospitalService("");
    onCloseConfirm();
  }
  async function handleEditCode() {
    const api = staffApi.editCodeBooking({
      status: editCodeValue,
      id: inforBooking?.id,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateBooking();
      onCloseEditStatusBooking();
    }
  }

  async function submitConfirm({
    type,
  }: {
    type: "delete-service" | "delete-prescription";
  }) {
    if (type == "delete-service") {
      handleDeleteServiceDetails();
    } else if (type == "delete-prescription") {
      handleDeletePrescriptionDetails();
    }
  }

  async function handleSubmitService() {
    try {
      const api = staffApi.createOrUpdateServiceDetails({
        id: valueServiceDetailsEdit,
        healthRecordId: dataHealthRecord?.rows?.[0]?.id,
        hospitalServiceId: valueHospitalService,
      });
      const res = await api;
      if (res.statusCode === 200) {
        mutateServiceDetails();
        onCloseService();
        // setValueServiceDetailsEdit("");
        setValueHospitalService("");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMsg = err.response.data.msg;
          toast.error(errorMsg);
        } else {
          toast.error("Lỗi không có phản hồi từ server");
        }
      } else {
        const errorWithMsg = err as { msg?: string };
        const errorMsg = errorWithMsg.msg || "Lỗi không xác định";
        toast.error(errorMsg);
      }
      return false;
    }
  }

  const router = useRouter();

  function clickPdf(type: "service" | "cedicine") {
    if (type == "service") {
      const Body = (
        <PDFViewer
          // onClick={handlePrintService}
          className="w-full h-full"
        >
          <ServiceDetailsBillDocument
            dataBooking={inforBooking}
            dataServiceDetails={dataServiceDetails}
            healthRecord={inforHealthRecord}
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
            dataBooking={inforBooking}
            prescriptionDetail={dataPrescriptionDetail}
            healthRecord={inforHealthRecord}
          />
        </PDFViewer>
      );
      setBodyDdf(Body);
    }

    onOpenPdf();
  }

  async function handleEditServiceDetails({
    id,
    result,
  }: {
    id: string;
    result: string;
  }) {
    const api = staffApi.createOrUpdateServiceDetails({
      id,
      descriptionResult: result,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateServiceDetails();
    }
    setValueServiceDetailsEdit("");
    setServiceDetailsEdit(undefined);
    onCloseUpdateResult();
  }

  function handleClickDelete(s: ServiceDetails) {
    setValueServiceDetailsEdit(s.id);
    onOpenConfirm();
  }
  function handleClickEdit(s: ServiceDetails) {
    setServiceDetailsEdit(s);
    onOpenUpdateResult();
  }

  // Prescription Details
  function handleClickDeletePrescriptionDetails(s: PrescriptionDetail) {
    setPrescriptionEdit(s);
    onOpenConfirmPre();
  }
  //delete
  async function handleDeletePrescriptionDetails() {
    // onOpenConfirm();
    const api = staffApi.deletePrescriptionDetail(obPrescriptionEdit?.id || "");
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutatePrescriptionDetail();
    }
    setPrescriptionEdit(undefined);
    onCloseConfirmPre();
  }
  function handleClickEditPrescriptionDetails(s: PrescriptionDetail) {
    setPrescriptionEdit(s);
    onOpenPrescriptionDetails();
  }

  async function handleSubmitPrescriptionDetail(
    data: Partial<PrescriptionDetail>
  ) {
    const api = staffApi.createOrUpdatePrescriptionDetail({
      ...data,
      healthRecordId: dataHealthRecord?.rows?.[0]?.id,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutatePrescriptionDetail();
    }

    onClosePrescriptionDetails();
    return res;
  }

  async function handleClickChangeSttService(stt: "waiting" | "doing") {
    //
    let statusCode = "";
    // waiting service
    if (stt == "waiting") statusCode = "HR2";
    else if (stt == "doing") statusCode = "HR3";
    const api = staffApi.editHealthRecord({
      id: dataHealthRecord?.rows?.[0]?.id,
      statusCode,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateBooking();
      mutateHealthRecord();
    }
  }

  async function handleSave() {
    const api = staffApi.editHealthRecord({
      id: dataHealthRecord?.rows?.[0]?.id,
      // waiting service
      // statusCode: "HR2",
      note,
      diagnosis,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateBooking();
    }
  }

  async function handleDoneAndSendEmail({
    blobSer,
    blobCe,
  }: {
    blobSer: Blob | null;
    blobCe: Blob | null;
  }) {
    //   const [diagnosis, setDiagnosis] = useState<string>("");
    // const [note, setNote] = useState<string>("");

    setLoadingPdf(true);
    const api = staffApi.editCheckUpDoneAndSendEmail({
      diagnosis,
      note,
      id: dataHealthRecord?.rows?.[0]?.id,
      emailDestination: emailSend,
      pdfs: [blobSer, blobCe],
    });
    const res = await toastMsgFromPromise(api);
    setLoadingPdf(false);
    if (res.statusCode === 200 || res.statusCode === 0) {
      onCloseConfirmEmailDone();
      mutateHealthRecord();
      router.push("/doctor/check-health");
    }
  }

  useEffect(() => {
    setNote(dataBooking?.rows?.[0].healthRecord?.note || "");
    setDiagnosis(dataBooking?.rows?.[0].healthRecord?.diagnosis || "");
  }, [
    dataBooking?.rows?.[0].healthRecord?.note,
    dataBooking?.rows?.[0].healthRecord?.diagnosis,
  ]);

  const done = useMemo(() => {
    return !!(diagnosis && (dataPrescriptionDetail?.length || -1) > 0);
  }, [diagnosis, dataServiceDetails, dataPrescriptionDetail]);
  console.log("inforHealthRecordinforHealthRecord", inforHealthRecord);
  return (
    <div className="mb-6">
      <div className="box-white ">
        {inforHealthRecord ? (
          <>
            <div>
              <div>
                <h3
                  className="my-2 mb-4 text-black text-sm font-medium flex 
                items-center gap-2 justify-between"
                >
                  THÔNG TIN PHIẾU
                  {inforHealthRecord?.statusCode == "HR4" && (
                    <div>
                      <Chip
                        size="md"
                        variant="flat"
                        radius="sm"
                        color="success"
                        startContent={
                          <span className="mx-1">
                            <IoCheckmarkDoneOutline size={18} />
                          </span>
                        }
                      >
                        Đã khám
                      </Chip>
                    </div>
                  )}
                  {inforHealthRecord?.statusCode == "HR2" ? (
                    <div>
                      <Chip
                        startContent={<NotificationIcon size={18} />}
                        variant="flat"
                        color="warning"
                        radius="sm"
                        size="md"
                      >
                        Đang đợi kết quả dịch vụ!
                      </Chip>
                    </div>
                  ) : (
                    <></>
                  )}
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className={`md:col-span-6 grid-cols-12 `}>
                    <Input
                      size="lg"
                      variant="bordered"
                      isReadOnly
                      label={
                        <div className="flex items-center gap-1">
                          <FaCode />
                          Mã phiếu khám
                        </div>
                      }
                      className={`${descClass} `}
                      value={inforHealthRecord?.id}
                    />
                  </div>

                  <div className="md:col-span-3 grid-cols-12 ">
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
                        inforBooking?.HealthExaminationSchedule?.date
                      ).format("L")}
                    />
                  </div>
                  <div className={"md:col-span-3 grid-cols-12 "}>
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
                        inforBooking?.HealthExaminationSchedule?.TimeCode?.value
                      }
                    />
                  </div>
                  <div className={"md:col-span-3 grid-cols-12 "}>
                    <Input
                      size="lg"
                      variant="bordered"
                      isReadOnly
                      label={
                        <div className="flex items-center gap-1">
                          <CiUser />
                          Bệnh nhân
                        </div>
                      }
                      className={`${descClass} font-medium`}
                      value={dataPatient?.rows?.[0]?.fullName}
                    />
                  </div>
                  <div className="md:col-span-9 grid-cols-12 ">
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
                          Tình trạng bệnh nhân
                        </div>
                      }
                      className={`${descClass}`}
                      value={inforBooking?.descriptionDisease}
                    />
                  </div>
                </div>
              </div>
              <Divider />
              <div>
                <h3 className="my-2 mb-4 text-black text-sm font-medium">
                  KHÁM BỆNH
                  <span className="ml-[2px] text-base text-red-400">*</span>
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="md:col-span-7 grid-cols-12 ">
                    <Textarea
                      size="lg"
                      label={
                        <div className="flex items-center gap-1">
                          <LuClipboardSignature />
                          Chuẩn đoán bệnh
                        </div>
                      }
                      placeholder="Chuẩn đoán tình trạng bệnh nhân"
                      className={`${descClass} text-base`}
                      classNames={{
                        label: "text-base",
                      }}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      value={diagnosis}
                    />
                  </div>
                  <div className="md:col-span-5 grid-cols-12 ">
                    <Textarea
                      classNames={{
                        label: "text-base",
                      }}
                      label={
                        <div className="flex items-center gap-1">
                          <MdOutlineNoteAlt />
                          Ghi chú
                        </div>
                      }
                      size="lg"
                      placeholder="Nhập ghi chú"
                      className={`${descClass}`}
                      onChange={(e) => setNote(e.target.value)}
                      value={note}
                    />
                  </div>
                </div>
                <h3 className="my-4 mt-6 text-black text-sm font-medium flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    DỊCH VỤ KHÁM BỆNH
                    {(dataServiceDetails?.length || -1) > 0 && (
                      <span
                        onClick={() => clickPdf("service")}
                        className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                      >
                        <FaRegFilePdf className="w-5 h-5" color="#d86d0f" />
                      </span>
                    )}
                    {/* {(dataServiceDetails?.length || -1) > 0 && (
                    <PDFDownloadLink
                      document={
                        <ServiceDetailsBillDocument
                          dataBooking={inforBooking}
                          dataServiceDetails={dataServiceDetails}
                          healthRecord={inforHealthRecord}
                        />
                      }
                      fileName="service.pdf"
                      // onClick={handlePrintService}
                      className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? "...PDF" : <DownLoadIcon />
                      }
                    </PDFDownloadLink>
                  )} */}
                  </div>
                  <AddActionBox
                    onClick={() => {
                      onOpenService();
                      setServiceDetailsEdit(undefined);
                    }}
                    content="thêm dịch vụ"
                  />
                </h3>
                <div className="grid col-span-12 gap-4">
                  {dataServiceDetails && dataServiceDetails?.length > 0 ? (
                    <TableServiceDetails
                      handleClickDelete={handleClickDelete}
                      handleClickEdit={handleClickEdit}
                      data={dataServiceDetails}
                    />
                  ) : (
                    <div>./</div>
                  )}
                </div>
                <h3 className="my-4 mt-6 text-black text-sm font-medium flex items-center justify-between gap-2">
                  <div className="flex-1 flex  items-center gap-4">
                    <div className="flex  items-center ">
                      TOA THUỐC
                      <span className="mx-[4px] text-base text-red-400">*</span>
                    </div>
                    {(dataPrescriptionDetail?.length || -1) > 0 && (
                      <span
                        onClick={() => clickPdf("cedicine")}
                        className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                      >
                        <FaRegFilePdf className="w-5 h-5" color="#d86d0f" />
                      </span>
                    )}
                    {/* {(dataPrescriptionDetail?.length || -1) > 0 && (
                    <PDFDownloadLink
                      document={
                        <CedicineDocument
                          dataBooking={inforBooking}
                          prescriptionDetail={dataPrescriptionDetail}
                          healthRecord={inforHealthRecord}
                        />
                      }
                      fileName="cadi.pdf"
                      // onClick={handlePrintService}
                      className="cursor-pointer hover:opacity-90 transition-all duration-150 hover:text-gray-600"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? "...PDF" : <DownLoadIcon />
                      }
                    </PDFDownloadLink>
                  )} */}
                  </div>
                  <AddActionBox
                    onClick={() => {
                      onOpenPrescriptionDetails();
                      setPrescriptionEdit(undefined);
                    }}
                    content="ghi thuốc"
                  />
                </h3>
                <div className="grid col-span-12 gap-4">
                  {dataPrescriptionDetail &&
                  dataPrescriptionDetail?.length > 0 ? (
                    <TablePrescriptionDetails
                      handleClickDelete={handleClickDeletePrescriptionDetails}
                      handleClickEdit={handleClickEditPrescriptionDetails}
                      data={dataPrescriptionDetail}
                    />
                  ) : (
                    <div>./</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 justify-end mt-8">
              {dataBooking?.rows?.[0]?.healthRecord?.statusCode !== "HR2" ? (
                <Button
                  color="warning"
                  variant="solid"
                  onPress={() => handleClickChangeSttService("waiting")}
                >
                  Chờ kết quả dịch vụ
                </Button>
              ) : (
                <Button
                  color="warning"
                  variant="light"
                  onPress={() => handleClickChangeSttService("doing")}
                >
                  Xóa chờ dịch vụ
                </Button>
              )}
              <Button
                color={"primary"}
                onPress={handleSave}
                // disabled={!dataBooking}
                isDisabled={!dataHealthRecord?.rows?.[0]}
              >
                Lưu phiếu
              </Button>

              <Button
                color={done ? "primary" : "default"}
                onPress={() => {
                  onOpenConfirmEmailDone();
                }}
                isDisabled={!done}
              >
                {inforHealthRecord?.statusCode == "HR4"
                  ? "Sửa thông tin"
                  : "Hoàn tất khám"}
              </Button>
            </div>

            <ModalFadeInNextUi
              size="3xl"
              id="service"
              backdrop="opaque"
              show={isOpenService}
              disable={!valueHospitalService}
              body={
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Autocomplete
                      label={"Dịch vụ"}
                      className="flex-1 min-w-[300px]"
                      selectedKey={valueHospitalService}
                      onSelectionChange={(e) =>
                        setValueHospitalService(e?.toString())
                      }
                      color={"primary"}
                      defaultItems={optionHospitalServices}
                      labelPlacement="inside"
                      isClearable={false}
                      size="lg"
                      placeholder={"Chọn dịch vụ"}
                      onKeyDown={(e: any) => e.continuePropagation()}
                      classNames={{}}
                    >
                      {(optionHospitalService) => (
                        <AutocompleteItem
                          key={optionHospitalService?.value || ""}
                          value={optionHospitalService?.value || ""}
                          textValue={optionHospitalService?.label || ""}
                        >
                          {optionHospitalService.label}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <Input
                      className="w-[200px]"
                      size="lg"
                      label={"Giá"}
                      type="text"
                      variant="bordered"
                      isReadOnly
                      value={dataHospitalService?.rows
                        .find(
                          (o: HospitalService) => o.id == valueHospitalService
                        )
                        ?.price?.toLocaleString()}
                      endContent="vnd"
                    ></Input>
                  </div>
                </div>
              }
              title="Thêm dịch vụ"
              toggle={onCloseService}
              handleSubmit={handleSubmitService}
            />

            {/* confirm */}
            <Modal size={"sm"} isOpen={isOpenConfirm} onClose={onCloseConfirm}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Bạn xác nhận xóa dịch vụ này ?
                    </ModalHeader>
                    <ModalBody>Thao tác này sẽ không thể khôi phục!</ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Hủy
                      </Button>
                      <Button
                        color="primary"
                        onPress={() =>
                          submitConfirm({ type: "delete-service" })
                        }
                      >
                        Xác nhận
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            {/*  prescription details */}
            <>
              <Modal
                size={"sm"}
                isOpen={isOpenConfirmPre}
                onClose={onCloseConfirmPre}
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Bạn xác nhận xóa thuốc này ?
                      </ModalHeader>
                      <ModalBody>
                        Thao tác này sẽ không thể khôi phục!
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Hủy
                        </Button>
                        <Button
                          color="primary"
                          onPress={() =>
                            submitConfirm({ type: "delete-prescription" })
                          }
                        >
                          Xác nhận
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>

            {/* conffirm */}
            <>
              <Modal
                size={"xl"}
                isOpen={isOpenConfirmEmailDone}
                onClose={onCloseConfirmEmailDone}
              >
                <ModalContent>
                  {(onCloseConfirmEmailDone) => (
                    <>
                      {/* <ModalHeader className="flex flex-col gap-1">
                      Bạn xác nhận xóa thuốc này ?
                    </ModalHeader> */}
                      <ModalBody>
                        <div className="flex items-center gap-3 mt-3">
                          <div> Gửi kết quả về email</div>
                          <Input
                            value={emailSend}
                            color="default"
                            size="lg"
                            onChange={(e) => setEmailSend(e.target.value)}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onCloseConfirmEmailDone}
                        >
                          Trở về
                        </Button>

                        <BlobProvider
                          document={
                            <ServiceDetailsBillDocument
                              dataBooking={inforBooking}
                              dataServiceDetails={dataServiceDetails}
                              healthRecord={inforHealthRecord}
                            />
                          }
                        >
                          {({ blob: blobSer, url, loading: l1 }) => {
                            return (
                              <BlobProvider
                                document={
                                  // <PrescriptDeBillDocument
                                  //   dataBooking={inforBooking}
                                  //   dataServiceDetails={dataServiceDetails}
                                  //   healthRecord={inforHealthRecord}
                                  // />
                                  <CedicineDocument
                                    dataBooking={inforBooking}
                                    prescriptionDetail={dataPrescriptionDetail}
                                    healthRecord={inforHealthRecord}
                                  />
                                }
                              >
                                {({ blob: blobCe, url, loading: l2 }) => {
                                  return (
                                    <Button
                                      color={
                                        l1 || l2 || loadingPdf
                                          ? "default"
                                          : "primary"
                                      }
                                      onPress={() => {
                                        handleDoneAndSendEmail({
                                          blobSer,
                                          blobCe,
                                        });
                                      }}
                                      // disabled={!dataBooking}
                                      isLoading={l1 || l2 || loadingPdf}
                                      isDisabled={!emailSend}
                                    >
                                      {l1 || l2
                                        ? "Đang load file"
                                        : "Xác nhận và gửi email"}
                                    </Button>
                                  );
                                }}
                              </BlobProvider>
                            );
                          }}
                        </BlobProvider>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
            {/* update result */}
            <ModalUpdateServiceDetails
              handleClickSubmit={handleEditServiceDetails}
              isOpen={isOpenUpdateResult}
              objectEdit={obServiceDetailsEdit}
              onClose={onCloseUpdateResult}
            />

            {/*  prescription details */}
            <ModalFadeInNextUi
              backdrop="opaque"
              show={isOpenPrescriptionDetails}
              toggle={onClosePrescriptionDetails}
              id="prescription-details"
              title="Thêm thuốc"
              size="4xl"
              body={
                <BodyPrescriptionDetails
                  clickCancel={onClosePrescriptionDetails}
                  handleSubmitForm={handleSubmitPrescriptionDetail}
                  obEdit={obPrescriptionEdit}
                />
              }
              footer={false}
            />

            {/* pdf */}
            <Modal size={"full"} isOpen={isOpenPdf} onClose={onClosePdf}>
              <ModalContent>
                {(onClosePdf) => (
                  <>
                    {/* <ModalHeader className="flex flex-col gap-1">PDF</ModalHeader> */}
                    <ModalBody>
                      <div className="w-full min-h-screen px-6 py-2">
                        {BodyPdf}
                      </div>
                    </ModalBody>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        ) : (
          <div className="min-h-[400px] flex items-center justify-center">
            {" "}
            <Button
              color="primary"
              size="md"
              variant="ghost"
              onPress={handleClickCreateHealthRecord}
            >
              Tạo phiếu khám
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
