import { doctorApi, PatientPost, staffApi, userApi } from "@/api-services";
import {
  API_ADMIN_HOSPITAL_SERVICE,
  API_ADMIN_MANAGER_SERVICE,
  API_DOCTOR_BOOKING,
  API_DOCTOR_HEALTH_RECORD,
  API_DOCTOR_PATIENT,
  API_DOCTOR_PRESCRIPTION_DETAILS,
  API_DOCTOR_SERVICE_DETAILS,
  API_PATIENT_PROFILE,
} from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import {
  Booking,
  HealthRecord,
  HospitalService,
  Patient,
  PatientProfile,
  PrescriptionDetail,
  ResBookingAndHealthRecord,
  ServiceDetails,
} from "@/models";
import { ResData, ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@nextui-org/react";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { ClipLoader, PulseLoader } from "react-spinners";
import useSWR from "swr";
import { InfoCheckUpContext } from "../admin-box/CheckUpDetails";
import { BodyAddEditPatient } from "../body-modal/BodyAddEditPatient";
import { BodyAddEditPatientProfile } from "../body-modal/BodyAddEditPatientProfile";
import { ActionBox, ActionGroup } from "../box";
import { AddActionBox } from "../box/AddActionBox";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import { MethodPayment } from "../common/step-boking/PaymentInformation";
import { getColorChipCheckUp } from "@/untils/common";
import { AddNoteIcon } from "../icons/AddNoteIcon";
import { PlusIcon } from "../icons/PlusIcon";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Divider } from "antd";
import { toast } from "react-toastify";
import { EyeIcon } from "../icons/EyeIcon";
import { ModalPositionHere } from "../modal";
import TableServiceDetails from "./TableServiceDetails";
import axios from "axios";
import ModalUpdateServiceDetails from "./ModalUpdateServiceDetails";
import TablePrescriptionDetails from "./TablePrescriptionDetails";
import BodyPrescriptionDetails from "../body-modal/BodyPrescriptionDetails";

export interface IInforBookingSlotProps {}

export default function InforBookingSlot(props: IInforBookingSlotProps) {
  const data = useContext(InfoCheckUpContext);
  const { bookingId } = useContext(InfoCheckUpContext);

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

  const { data: dataHospitalService, mutate: mutateHospitalService } = useSWR<
    ResDataPaginations<HealthRecord>
  >(
    `${API_ADMIN_MANAGER_SERVICE}?healthFacilityId=${inforBooking?.HealthExaminationSchedule?.Working?.healthFacilityId}`
  );

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

  const [diagnosis, setDiagnosis] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const boxClass = "md:col-span-3 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600";
  const footerClass = "mt-4 flex item-center justify-end";
  const labelHeading = "gr-title-admin mb-4 flex items-center gap-2";
  const colorInputStatus = getColorChipCheckUp(inforBooking?.Code?.key);
  const [obServiceDetailsEdit, setServiceDetailsEdit] = useState<
    ServiceDetails | undefined
  >();
  const [obPrescriptionEdit, setPrescriptionEdit] = useState<
    PrescriptionDetail | undefined
  >();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenService,
    onOpen: onOpenService,
    onClose: onCloseService,
  } = useDisclosure({ id: "add-service" });
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

  async function handleClickWatingService() {
    //
    const api = staffApi.editHealthRecord({
      id: dataHealthRecord?.rows?.[0]?.id,
      // waiting service
      statusCode: "HR2",
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutateBooking();
      onClose();
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

  useEffect(() => {
    setNote(dataBooking?.rows?.[0].healthRecord?.note || "");
    setDiagnosis(dataBooking?.rows?.[0].healthRecord?.diagnosis || "");
  }, [
    dataBooking?.rows?.[0].healthRecord?.note,
    dataBooking?.rows?.[0].healthRecord?.diagnosis,
  ]);

  return (
    <div className="mb-6">
      <div className="box-white ">
        <div className="flex justify-between gap-2 items-center">
          <h3 className={labelHeading}>
            Thông tin lịch hẹn
            <div>
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
            </div>
          </h3>
          {dataBooking?.rows?.[0]?.healthRecord.statusCode == "HR2" && (
            <div className="mb-4">
              <b>Trạng thái phiếu:</b>{" "}
              <Chip
                radius="sm"
                size="md"
                color="warning"
                variant="flat"
                className="ml-1"
              >
                ...wating
              </Chip>
            </div>
          )}
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className={`md:col-span-4 grid-cols-12 `}>
            <Input
              size="lg"
              isReadOnly
              label="Mã lịch hẹn"
              className={`${descClass} `}
              value={inforBooking?.id}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Ngày khám"
              className={`${descClass} font-medium`}
              value={moment(
                inforBooking?.HealthExaminationSchedule?.date
              ).format("L")}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Khung giờ - bắt đầu từ"
              className={`${descClass}`}
              value={inforBooking?.HealthExaminationSchedule?.TimeCode?.value}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Dịch vụ"
              className={`${descClass}`}
              value={"Đặt khám theo bác sỉ"}
            />
          </div>
          <div className={boxClass}>
            {/* <PulseLoader color="gray" size={4} /> */}
            <Input
              size="lg"
              isReadOnly
              label="Ngày tạo lịch"
              className={`${descClass}`}
              value={moment(inforBooking?.createdAt).format("L")}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Phương thức thanh toán"
              className={`${descClass}`}
              value={
                MethodPayment[
                  inforBooking?.paymentType as keyof typeof MethodPayment
                ]
              }
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              color={colorInputStatus}
              isReadOnly
              label="Trạng thái"
              className={`${descClass}`}
              value={inforBooking?.Code?.value}
            />
          </div>
        </div>

        <div className={footerClass}>
          {dataHealthRecord?.rows?.[0] ? (
            <Button
              color="primary"
              size="md"
              onClick={onOpen}
              className="flex items-center"
              startContent={
                <span className="flex items-center">
                  <EyeIcon width={20} color="white" />
                </span>
              }
            >
              <div className="relative top-[-1px]"> Xem phiếu khám</div>
            </Button>
          ) : (
            <Button
              color="primary"
              size="md"
              onClick={handleClickCreateHealthRecord}
              className="flex items-center"
              startContent={
                <span className="flex items-center">
                  <PlusIcon width={20} color="white" />
                </span>
              }
            >
              <div className="relative top-[-1px]"> Tạo phiếu khám</div>
            </Button>
          )}
        </div>
      </div>

      {/* modal */}
      <>
        <div className="flex flex-wrap gap-3"></div>
        <Modal
          size={"5xl"}
          isOpen={isOpen}
          onClose={onClose}
          isDismissable={false}
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Phiếu khám bệnh
                </ModalHeader>
                <ModalBody>
                  {dataHealthRecord?.rows?.[0] ? (
                    <div>
                      <div>
                        <h3 className="my-2 mb-4 text-black text-sm font-medium">
                          THÔNG TIN PHIẾU{" "}
                        </h3>
                        <div className="grid grid-cols-12 gap-4">
                          <div className={`md:col-span-6 grid-cols-12 `}>
                            <Input
                              size="lg"
                              isReadOnly
                              label="Mã phiếu khám"
                              className={`${descClass} `}
                              value={inforBooking?.id}
                            />
                          </div>

                          <div className="md:col-span-3 grid-cols-12 ">
                            <Input
                              size="lg"
                              isReadOnly
                              label="Ngày khám"
                              className={`${descClass} font-medium`}
                              value={moment(
                                inforBooking?.HealthExaminationSchedule?.date
                              ).format("L")}
                            />
                          </div>
                          <div className={"md:col-span-3 grid-cols-12 "}>
                            <Input
                              size="lg"
                              isReadOnly
                              label="Khung giờ - bắt đầu từ"
                              className={`${descClass}`}
                              value={
                                inforBooking?.HealthExaminationSchedule
                                  ?.TimeCode?.value
                              }
                            />
                          </div>
                          <div className={"md:col-span-3 grid-cols-12 "}>
                            <Input
                              size="lg"
                              isReadOnly
                              label="Bệnh nhân"
                              className={`${descClass} font-medium`}
                              value={dataPatient?.rows?.[0]?.fullName}
                            />
                          </div>
                          <div className="md:col-span-9 grid-cols-12 ">
                            <Textarea
                              size="lg"
                              isReadOnly
                              label="Tình trạng bệnh nhân"
                              className={`${descClass}`}
                              value={inforBooking?.descriptionDisease}
                            />
                          </div>
                        </div>
                      </div>
                      <Divider />
                      <div>
                        <h3 className="my-2 mb-4 text-black text-sm font-medium">
                          KHÁM BỆNH{" "}
                          <span className="ml-[2px] text-base text-red-400">
                            *
                          </span>
                        </h3>
                        <div className="grid grid-cols-12 gap-4">
                          <div className="md:col-span-7 grid-cols-12 ">
                            <Textarea
                              size="lg"
                              placeholder="Chuẩn đoán tình trạng bệnh nhân"
                              label="Chuẩn đoán bệnh"
                              className={`${descClass}`}
                              onChange={(e) => setDiagnosis(e.target.value)}
                              value={diagnosis}
                            />
                          </div>
                          <div className="md:col-span-5 grid-cols-12 ">
                            <Textarea
                              size="lg"
                              placeholder="Nhập ghi chú"
                              label="Ghi chú"
                              className={`${descClass}`}
                              onChange={(e) => setNote(e.target.value)}
                              value={note}
                            />
                          </div>
                        </div>
                        <h3 className="my-4 mt-6 text-black text-sm font-medium flex items-center justify-between gap-2">
                          DỊCH VỤ KHÁM BỆNH
                          <AddActionBox
                            onClick={() => {
                              onOpenService();
                              setServiceDetailsEdit(undefined);
                            }}
                            content="thêm dịch vụ"
                          />
                        </h3>
                        <div className="grid col-span-12 gap-4">
                          {dataServiceDetails &&
                          dataServiceDetails?.length > 0 ? (
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
                          <div className="flex-1">
                            TOA THUỐC
                            <span className="ml-[4px] text-base text-red-400">
                              *
                            </span>
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
                              handleClickDelete={
                                handleClickDeletePrescriptionDetails
                              }
                              handleClickEdit={
                                handleClickEditPrescriptionDetails
                              }
                              data={dataPrescriptionDetail}
                            />
                          ) : (
                            <div>./</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-60">
                      <ClipLoader color="blue" />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Hủy
                  </Button>

                  {(dataServiceDetails?.length || -1) > 0 && (
                    <Button
                      color="warning"
                      variant="solid"
                      onPress={handleClickWatingService}
                    >
                      Chờ kết quả dịch vụ
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
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
                  // defaultInputValue={defaultInputValue}
                  // onChange={(e) => setValueHospitalService(e.target.value)}
                  onSelectionChange={(e) =>
                    setValueHospitalService(e?.toString())
                  }
                  color={"primary"}
                  // value={value}
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
                  isReadOnly
                  value={
                    dataHospitalService?.rows.find(
                      (o: HospitalService) => o.id == valueHospitalService
                    )?.price
                  }
                ></Input>
              </div>
            </div>
          }
          title="Thêm dịch vụ"
          toggle={onCloseService}
          handleSubmit={handleSubmitService}
        />

        {/* confirm */}
        <>
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
                      onPress={() => submitConfirm({ type: "delete-service" })}
                    >
                      Xác nhận
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
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
                  <ModalBody>Thao tác này sẽ không thể khôi phục!</ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
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
          size="2xl"
          body={
            <BodyPrescriptionDetails
              clickCancel={onClosePrescriptionDetails}
              handleSubmitForm={handleSubmitPrescriptionDetail}
              obEdit={obPrescriptionEdit}
            />
          }
          footer={false}
        />
      </>
    </div>
  );
}
