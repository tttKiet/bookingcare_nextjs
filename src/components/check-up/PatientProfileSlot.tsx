import { doctorApi, PatientPost, userApi } from "@/api-services";
import {
  API_DOCTOR_BOOKING,
  API_DOCTOR_PATIENT,
  API_PATIENT_PROFILE,
} from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import {
  Booking,
  Patient,
  PatientProfile,
  ResBookingAndHealthRecord,
} from "@/models";
import { ResData, ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import {
  Chip,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import moment from "moment";
import { useContext, useEffect, useMemo, useState } from "react";
import { PulseLoader } from "react-spinners";
import useSWR from "swr";
import { InfoCheckUpContext } from "../admin-box/CheckUpDetails";
import { BodyAddEditPatient } from "../body-modal/BodyAddEditPatient";
import { BodyAddEditPatientProfile } from "../body-modal/BodyAddEditPatientProfile";
import { ActionBox, ActionGroup } from "../box";
import { AddActionBox } from "../box/AddActionBox";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import { NotificationIcon } from "../icons/NotificationIcon";
import { CiCalendarDate, CiLocationOn, CiUser } from "react-icons/ci";
import { HiOutlinePhone } from "react-icons/hi";
import { MdOutlineMail } from "react-icons/md";
import { FaRegAddressCard, FaSwatchbook } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { PiGenderIntersex } from "react-icons/pi";
import { SiRotaryinternational } from "react-icons/si";

export interface IPatientProfileProps {}

export default function PatientProfileSlot(props: IPatientProfileProps) {
  const { bookingId } = useContext(InfoCheckUpContext);

  const { data: dataBooking, mutate } = useSWR<
    ResDataPaginations<ResBookingAndHealthRecord>
  >(`${API_DOCTOR_BOOKING}?bookingId=${bookingId}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  const infoCheckUp: Booking | undefined = useMemo(
    () => dataBooking?.rows?.[0]?.booking,
    [dataBooking]
  );

  const { profile } = useAuth();

  const { data: dataPatientProfile, mutate: mutatePatientProfile } =
    useSWR<PatientProfile>(
      `${API_PATIENT_PROFILE}?patientProfileId=${infoCheckUp?.PatientProfile?.id}`
    );
  const {
    data: dataPatient,
    mutate: mutatePatient,
    isLoading: loadPatient,
  } = useSWR<ResDataPaginations<Patient>>(
    `${API_DOCTOR_PATIENT}?cccd=${infoCheckUp?.PatientProfile?.cccd}`
  );

  const patient: Patient = useMemo(() => {
    return dataPatient?.rows?.[0];
  }, [dataPatient]);

  const boxClass = "md:col-span-4 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600";
  const footerClass = "mt-4 flex item-center justify-end";

  const [address, setAddress] = useState<string>("");

  // state

  useEffect(() => {
    useGetAddress({
      wardCode: dataPatientProfile?.addressCode[0] || "",
      districtCode: dataPatientProfile?.addressCode[1] || "",
      provinceCode: dataPatientProfile?.addressCode[2] || "",
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [
    dataPatientProfile?.addressCode[0],
    dataPatientProfile?.addressCode[1],
    dataPatientProfile?.addressCode[2],
  ]);
  const labelHeading = "gr-title-admin mb-4 flex items-center gap-1";
  return (
    <div className="box-white ">
      <div className="">
        <h3 className={labelHeading}>Thông tin người khám</h3>

        <div className="grid grid-cols-12 gap-4">
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label={
                <div className="flex items-center gap-1">
                  <CiUser />
                  Tên người khám
                </div>
              }
              className={descClass}
              value={dataPatientProfile?.fullName}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label={
                <div className="flex items-center gap-1">
                  <FaRegAddressCard />
                  CCCD
                </div>
              }
              className={`${descClass} font-medium`}
              value={dataPatientProfile?.cccd}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label={
                <div className="flex items-center gap-1">
                  <HiOutlinePhone />
                  Số điện thoại
                </div>
              }
              className={`${descClass}`}
              value={dataPatientProfile?.phone}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label={
                <div className="flex items-center gap-1">
                  <MdOutlineMail />
                  Email
                </div>
              }
              className={`${descClass}`}
              value={dataPatientProfile?.email}
            />
          </div>
          <div className={boxClass}>
            {/* <PulseLoader color="gray" size={4} /> */}
            <Input
              size="lg"
              isReadOnly
              label={
                <div className="flex items-center gap-1">
                  <CiLocationOn />
                  Địa chỉ
                </div>
              }
              className={`${descClass}`}
              value={address || "..."}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className={labelHeading}>
          Thông tin bệnh nhân
          <Popover placement="top" color="primary">
            <PopoverTrigger>
              <span className="p-1 cursor-pointer hover:opacity-95 transition-all">
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
              </span>
            </PopoverTrigger>

            <PopoverContent>
              <div>Thông tin đã được xác nhận</div>
            </PopoverContent>
          </Popover>
        </h3>

        {!loadPatient && patient ? (
          <div className="grid grid-cols-12 gap-4">
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <CiUser />
                    Tên người khám
                  </div>
                }
                className={descClass}
                value={patient?.fullName}
              />
            </div>
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <FaRegAddressCard />
                    CCCD
                  </div>
                }
                className={`${descClass} font-medium`}
                value={patient?.cccd}
              />
            </div>
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <CiCalendarDate />
                    Giới tinh
                  </div>
                }
                className={`${descClass}`}
                value={patient?.gender == "male" ? "Nam" : "Nữ"}
              />
            </div>

            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <MdOutlineMail />
                    Email
                  </div>
                }
                className={`${descClass}`}
                value={patient?.email}
              />
            </div>
            <div className={"md:col-span-6 grid-cols-12 "}>
              {/* <PulseLoader color="gray" size={4} /> */}
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <CiLocationOn />
                    Địa chỉ
                  </div>
                }
                className={`${descClass}`}
                value={address || "..."}
              />
            </div>
            <div className={"md:col-span-2 grid-cols-12 "}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <PiGenderIntersex />
                    Giới tính
                  </div>
                }
                className={`${descClass}`}
                value={moment(patient?.birthDay).format("L")}
              />
            </div>
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <HiOutlinePhone />
                    Số điện thoại
                  </div>
                }
                className={`${descClass}`}
                value={patient?.phone}
              />
            </div>
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <SiRotaryinternational />
                    Tôn giáo
                  </div>
                }
                className={`${descClass}`}
                value={patient?.nation}
              />
            </div>
            <div className={boxClass}>
              <Input
                color="primary"
                size="lg"
                isReadOnly
                label={
                  <div className="flex items-center gap-1">
                    <FaSwatchbook />
                    Nghề nghiệp
                  </div>
                }
                className={`${descClass}`}
                value={patient?.profession}
              />
            </div>
          </div>
        ) : (
          <div>
            <Chip
              startContent={<NotificationIcon size={18} />}
              variant="flat"
              color="warning"
              radius="sm"
              size="md"
            >
              Bệnh nhân chưa được tạo!
            </Chip>
          </div>
        )}
      </div>
    </div>
  );
}
