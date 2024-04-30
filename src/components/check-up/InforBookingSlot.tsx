import { staffApi } from "@/api-services";
import {
  API_ADMIN_MANAGER_SERVICE,
  API_CODE,
  API_DOCTOR_BOOKING,
  API_DOCTOR_HEALTH_RECORD,
  API_DOCTOR_PATIENT,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SERVICE_DETAILS,
} from "@/api-services/constant-api";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
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
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
  useDisclosure,
  User,
} from "@nextui-org/react";
import { BlobProvider, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Divider } from "antd";
import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import useSWR from "swr";
import { InfoCheckUpContext } from "../admin-box/CheckUpDetails";
import BodyPrescriptionDetails from "../body-modal/BodyPrescriptionDetails";
import { AddActionBox } from "../box/AddActionBox";
import { MethodPayment } from "../common/step-boking/PaymentInformation";
import { EyeIcon } from "../icons/EyeIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { PrintIcon } from "../icons/PrintIcon";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import ServiceDetailsBillDocument from "../pdf/ServiceDetailsBillDocument";
import ModalUpdateServiceDetails from "./ModalUpdateServiceDetails";
import TablePrescriptionDetails from "./TablePrescriptionDetails";
import TableServiceDetails from "./TableServiceDetails";
import CedicineDocument from "../pdf/CedicineDocument";
import { FaRegFilePdf } from "react-icons/fa6";
import { DownLoadIcon } from "../icons/DownLoadIcon";
import { TbClockHour2, TbRuler3 } from "react-icons/tb";
import { ActionBox } from "../box";
import { HiMiniXMark } from "react-icons/hi2";
import { SelectFieldNext } from "../form/SelectFieldNext";
import { FaCheck, FaCode, FaUserMd } from "react-icons/fa";
import { FcCheckmark } from "react-icons/fc";
import { PiSealCheckThin, PiSealWarningLight } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { BiClinic } from "react-icons/bi";

export interface IInforBookingSlotProps {}

export default function InforBookingSlot(props: IInforBookingSlotProps) {
  const data = useContext(InfoCheckUpContext);
  const { bookingId } = useContext(InfoCheckUpContext);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const [editCodeValue, setEditCodeValue] = useState<string>("");
  // const [pdfCe, setPdfCe] = useState<Blob | null>(null);
  // const [pdfSer, setPdfSer] = useState<Blob | null>(null);
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
      `${API_DOCTOR_PRESCRIPTION_DETAILS}?healthRecordId=${dataHealthRecord?.rows?.[0]?.id}`
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

  const optCodeEdit = useMemo<
    {
      label: string;
      value: string;
    }[]
  >(() => {
    return (
      codeBooking?.rows?.map((c: Code) => ({
        label: c.value,
        value: c.key,
      })) || []
    );
  }, [codeBooking]);

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

  const { isOpen, onOpen, onClose } = useDisclosure();
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
    } else if (!dataPatient?.rows?.[0]?.id) {
      return toast.warning(
        "Bệnh nhân chưa được thêm vào cơ sở dữ liệu, hãy tạo bệnh nhân."
      );
    }
    onOpen();
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
      if (statusCode == "HR2") {
        onClose();
      }
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
      onClose();
    }
  }

  async function handleDoneAndSendEmail({
    blobSer,
    blobCe,
  }: {
    blobSer: Blob | null;
    blobCe: Blob | null;
  }) {
    setLoadingPdf(true);
    const api = staffApi.editCheckUpDoneAndSendEmail({
      id: dataHealthRecord?.rows?.[0]?.id,
      emailDestination: emailSend,
      pdfs: [blobSer, blobCe],
    });
    const res = await toastMsgFromPromise(api);
    setLoadingPdf(false);
    if (res.statusCode === 200 || res.statusCode === 0) {
      onCloseConfirmEmailDone();
      onClose();
      mutateHealthRecord();
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

  return (
    <div className="mb-6">
      <div className="box-white ">
        <div className="flex justify-between gap-2 items-center">
          <h3 className={labelHeading}>
            Thông tin lịch hẹn
            {/* <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                color="blue"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
            </div> */}
          </h3>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className={"col-span-5 row-span-3 font-medium"}>
            <div className="p-5 border-2 border-blue-700  rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2 ">
                <h4 className="text-gray-500">Tài khoản đặt lịch:</h4>
                <User
                  name={inforBooking?.PatientProfile?.User?.fullName}
                  description={inforBooking?.PatientProfile?.User?.email}
                />
              </div>
              <div className="flex items-center justify-between gap-2 mb-2 ">
                <h4 className="text-gray-500">Ngày tạo:</h4>
                <div>{moment(inforBooking?.createdAt).format("L")}</div>
              </div>
              <div className="flex items-center justify-between gap-2 mb-2 ">
                <h4 className="text-gray-500">Giá khám:</h4>
                <div>{inforBooking?.doctorPrice.toLocaleString()} vnđ</div>
              </div>
              <div className="flex items-center justify-between gap-2 mb-2 ">
                <h4 className="text-gray-500">Phương thức thanh toán:</h4>
                <div>
                  {
                    MethodPayment[
                      inforBooking?.paymentType as keyof typeof MethodPayment
                    ]
                  }
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mb-2 ">
                <h4 className="text-gray-500">Trạng thái:</h4>
                <div className="flex items-center gap-1">
                  {inforBooking?.Code?.key == "CU1" && (
                    <Popover placement="top" color="warning">
                      <PopoverTrigger>
                        <span className="p-1 cursor-pointer hover:opacity-95 transition-all">
                          <PiSealWarningLight size={22} color="#C4841D" />
                        </span>
                      </PopoverTrigger>

                      <PopoverContent>
                        <div>
                          Người dùng cần đến quầy thanh toán trước khi khám bệnh
                          !
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  {inforBooking?.Code?.key == "CU2" && (
                    <Popover placement="top" color="primary">
                      <PopoverTrigger>
                        <span className="p-1 cursor-pointer hover:opacity-95 transition-all">
                          <PiSealCheckThin size={22} color="blue" />
                        </span>
                      </PopoverTrigger>

                      <PopoverContent>
                        <div>Thanh toán đã xác nhận</div>
                      </PopoverContent>
                    </Popover>
                  )}
                  <div>{inforBooking?.Code?.value}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-7 grid grid-cols-12 gap-5">
            <div className={"col-span-6 font-medium"}>
              <Input
                size="lg"
                variant="bordered"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <FaCode />
                    Mã lịch hẹn
                  </div>
                }
                className={`${descClass} `}
                value={inforBooking?.id}
              />
            </div>
            <div className={"col-span-3 font-medium"}>
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
                className={`${descClass} `}
                value={moment(
                  inforBooking?.HealthExaminationSchedule?.date
                ).format("L")}
              />
            </div>
            <div className={"col-span-3 font-medium"}>
              <Input
                label={
                  <div className="flex items-center gap-1">
                    <TbClockHour2 />
                    Khung giờ
                  </div>
                }
                size="lg"
                variant="bordered"
                isReadOnly
                className={`${descClass}`}
                value={inforBooking?.HealthExaminationSchedule?.TimeCode?.value}
              />
            </div>
            <div className={"col-span-3 font-medium"}>
              <Input
                size="lg"
                variant="bordered"
                isReadOnly
                className={`${descClass}`}
                label={
                  <div className="flex items-center gap-1">
                    <FaUserMd />
                    Bác sĩ
                  </div>
                }
                value={
                  inforBooking?.HealthExaminationSchedule?.Working?.Staff
                    ?.fullName
                }
              />
            </div>
            <div className={"col-span-6 font-medium"}>
              <Input
                size="lg"
                variant="bordered"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <BiClinic />
                    Cở sở y tế
                  </div>
                }
                className={`${descClass}`}
                value={
                  inforBooking?.HealthExaminationSchedule?.Working
                    ?.HealthFacility?.name
                }
              />
            </div>
            {/* <div className={"col-span-3 font-medium"}>
              <Input
                size="lg"
                 variant="bordered"
              isReadOnly
                label="Phòng khám"
                className={`${descClass}`}
                value={
                  inforBooking?.w
                }
              />
            </div> */}
          </div>
          {/* <div className={boxClass}>
            <Input
              size="lg"
               variant="bordered"
              isReadOnly
              label="Phương thức thanh toán"
              className={`${descClass}`}
              value={
                MethodPayment[
                  inforBooking?.paymentType as keyof typeof MethodPayment
                ]
              }
            />
          </div> */}
          {/* <div className={boxClass}>
            <Input
              size="lg"
              color={colorInputStatus}
               variant="bordered"
              isReadOnly
              label="Trạng thái"
              className={`${descClass}`}
              value={inforBooking?.Code?.value}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
}
