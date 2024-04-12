import { ColorBox } from "../box";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import { PatientProfile } from "@/models";
import { API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfileItem } from "./PatientProfileItem";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import Link from "next/link";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import { randomInt } from "crypto";
import { data } from "autoprefixer";
import moment from "moment";
import { BiUserPin } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
const { confirm } = Modal;

export interface IPartientProfileProps {}

export function PartientProfile(props: IPartientProfileProps) {
  const { profile } = useAuth();

  const { data: responsePatientProfile, mutate: mutatePatientProfile } = useSWR<
    ResDataPaginations<PatientProfile>
  >(`${API_PATIENT_PROFILE}?userId=${profile?.id || ""}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  function handleDeletePatientProfile(id: string): void {
    confirm({
      title: `Bạn có muốn xóa hồ sơ này?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${id}" và không thể khôi phục`,
      async onOk() {
        const api = userApi.deletePatientProfile(id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutatePatientProfile();
        return isOk;
      },
      onCancel() {},
    });
  }

  return (
    <div>
      <h4 className="text-black-main text-lg pb-4 font-medium px-2  ">
        Danh sách hồ sơ bệnh nhân
      </h4>
      <div className="">
        <Accordion variant="splitted">
          {responsePatientProfile?.rows.map((p: PatientProfile) => (
            <AccordionItem
              key={p.id}
              title={p.fullName}
              startContent={
                <Avatar
                  name={p.fullName}
                  isBordered
                  color="default"
                  radius="lg"
                  className="mr-2"
                />
              }
              subtitle={`${Math.ceil(Math.random()) * 3} lần khám`}
            >
              <PatientProfileItem
                data={p}
                onClickDelete={handleDeletePatientProfile}
              />
            </AccordionItem>
          ))}
        </Accordion>

        {/* {responsePatientProfile?.rows.map((p: PatientProfile) => (
          <div className="col-span-12" key={p.id}>
            <PatientProfileItem
              p={p}
              onClickDelete={handleDeletePatientProfile}
            />
          </div>
        ))} */}

        {/* {responsePatientProfile?.rows.length == 0 && (
          <p className="col-span-12">
            Bạn chưa có hồ sơ nào. Tạo hồ sơ ngay
            <Link
              href="/user?tag=add-patient-profile"
              className="text-blue-500"
            >
              tại đây
            </Link>
            .
          </p>
        )} */}
      </div>
    </div>
  );
}
