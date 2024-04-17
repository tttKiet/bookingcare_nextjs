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
  const [obEditPatient, setObEditPatient] = useState<Patient | undefined>();

  const { data: dataPatientProfile, mutate: mutatePatientProfile } =
    useSWR<PatientProfile>(
      `${API_PATIENT_PROFILE}?patientProfileId=${infoCheckUp?.PatientProfile?.id}`
    );
  const { data: dataPatient, mutate: mutatePatient } = useSWR<
    ResDataPaginations<Patient>
  >(`${API_DOCTOR_PATIENT}?cccd=${infoCheckUp?.PatientProfile?.cccd}`);

  const boxClass = "md:col-span-4 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600";
  const footerClass = "mt-4 flex item-center justify-end";

  const [address, setAddress] = useState<string>("");

  // state
  const [isShowModalPatient, setIsShowModalPatient] = useState<boolean>(false);
  const [isShowModalPatientProfile, setIsShowModalProfile] =
    useState<boolean>(false);

  // function
  function handleClickAddPatient() {
    toggleShowModalPatient();
  }

  function handleClickEditPatient() {
    setObEditPatient(dataPatient?.rows?.[0]);
    toggleShowModalPatient();
  }

  async function handleSubmitPatient(data: any): Promise<boolean> {
    // console.log("datadata", data);
    const {
      fullName,
      birthDay,
      cccd,
      district,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      province,
      ward,
    } = data;

    const dataPost: Partial<PatientPost> = {
      fullName,
      birthDay,
      cccd,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      addressCode: [ward, district, province],
      staffId: profile?.id,
    };

    const api = doctorApi.createOrUpdatePatient(dataPost);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      // mutate();
    }
    mutatePatient();
    return isOk;
  }

  async function handleSubmitPatientProfile(data: any): Promise<boolean> {
    // console.log("datadata", data);
    const {
      fullName,
      birthDay,
      cccd,
      district,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      province,
      ward,
      userId,
    } = data;

    const dataPost: Partial<PatientProfile> = {
      fullName,
      birthDay,
      cccd,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      userId,
      addressCode: [ward, district, province],
    };

    const api = userApi.createOrUpdatePatientProfile(dataPost);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      // mutate();
      mutatePatientProfile();
    }
    return isOk;
  }

  function getInfoFromProfile() {
    return dataPatientProfile;
  }

  // toggle
  function toggleShowModalPatient() {
    setIsShowModalPatient((s) => !s);
  }

  function toggleShowModalPatientProfile() {
    setIsShowModalProfile((s) => !s);
  }

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
  const labelHeading = "gr-title-admin mb-4 flex items-center justify-between ";
  return (
    <div className="">
      <ModalFadeInNextUi
        id="patient"
        backdrop="opaque"
        show={isShowModalPatient}
        toggle={toggleShowModalPatient}
        title="Quản lý thông tin bệnh nhân"
        size="5xl"
        body={
          <BodyAddEditPatient
            clickCancel={toggleShowModalPatient}
            handleSubmitForm={handleSubmitPatient}
            getInfoFromProfile={getInfoFromProfile}
            obEditPatient={obEditPatient}
          />
        }
        footer={false}
      />

      <ModalFadeInNextUi
        id="patient"
        backdrop="opaque"
        show={isShowModalPatientProfile}
        toggle={toggleShowModalPatientProfile}
        title="Hồ sơ bệnh nhân"
        size="5xl"
        body={
          <BodyAddEditPatientProfile
            clickCancel={toggleShowModalPatientProfile}
            handleSubmitForm={handleSubmitPatientProfile}
            obEditPatient={dataPatientProfile}
          />
        }
        footer={false}
      />

      <div className="box-white ">
        <h3 className={labelHeading}>Thông tin người khám</h3>

        <div className="grid grid-cols-12 gap-4">
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Tên người khám"
              className={descClass}
              value={dataPatientProfile?.fullName}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="CCCD"
              className={`${descClass} font-medium`}
              value={dataPatientProfile?.cccd}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Số điện thoại"
              className={`${descClass}`}
              value={dataPatientProfile?.phone}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Email"
              className={`${descClass}`}
              value={dataPatientProfile?.email}
            />
          </div>
          <div className={boxClass}>
            {/* <PulseLoader color="gray" size={4} /> */}
            <Input
              size="lg"
              isReadOnly
              label="Địa chỉ"
              className={`${descClass}`}
              value={address || "..."}
            />
          </div>
          <div className={boxClass}>
            <Input
              size="lg"
              isReadOnly
              label="Tên người khám"
              className={`${descClass}`}
              value={dataPatientProfile?.fullName}
            />
          </div>
        </div>

        <div className={footerClass}>
          <ActionGroup className="justify-start">
            <ActionBox type="edit" onClick={toggleShowModalPatientProfile} />
            {/* <ActionBox type="delete" onClick={() => onClickDelete(data.id)} /> */}
          </ActionGroup>
        </div>
      </div>
      <div className="my-6 box-white">
        <h3 className={labelHeading}>Chi tiết bệnh nhân</h3>

        <div className="mb-8">
          {dataPatient?.rows?.[0] ? (
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>Tên Bệnh nhân</TableColumn>
                <TableColumn>CCCD</TableColumn>
                <TableColumn>Giới tính</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Cơ sở y tế</TableColumn>
                <TableColumn>Ghi chú</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>{dataPatient?.rows?.[0]?.fullName}</TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <i>{dataPatient?.rows?.[0]?.cccd}</i>
                    </div>
                  </TableCell>
                  <TableCell>
                    {dataPatient?.rows?.[0]?.gender == "male" ? "Nam" : "Nữ"}
                  </TableCell>
                  <TableCell>{dataPatient?.rows?.[0]?.email}</TableCell>
                  <TableCell>
                    {dataPatient?.rows?.[0]?.HealthFacility?.name}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color="primary"
                      size="md"
                      variant="dot"
                      className="capitalize border-none gap-1 text-default-600 "
                    >
                      <div className="flex items-center relative top-[-2px] gap-2">
                        <span> Đã tạo ngày </span>
                        <span className="">
                          {moment(dataPatient?.rows?.[0]?.createdAt).format(
                            "L"
                          )}
                        </span>
                      </div>
                    </Chip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <div>Bệnh nhân chưa được tạo ở bệnh viên này.</div>
          )}
        </div>
        <div className={footerClass}>
          <ActionGroup className="justify-start">
            {dataPatient?.rows.length > 0 ? (
              <ActionBox type="edit" onClick={handleClickEditPatient} />
            ) : (
              <AddActionBox
                onClick={handleClickAddPatient}
                content="tạo bệnh nhân"
              />
            )}
          </ActionGroup>
        </div>
      </div>
    </div>
  );
}
