import * as React from "react";
import { ColorBox } from "../box";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import { PatientProfile } from "@/models";
import { API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfileItem } from "./patient-profile.item";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import Link from "next/link";
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
    <ColorBox title="Danh sách hồ sơ bệnh nhân">
      <div className="grid grid-cols-12">
        {responsePatientProfile?.rows.map((p: PatientProfile) => (
          <div className="col-span-12" key={p.id}>
            <PatientProfileItem
              data={p}
              onClickDelete={handleDeletePatientProfile}
            />
          </div>
        ))}
        {responsePatientProfile?.rows.length == 0 && (
          <p className="col-span-12">
            Bạn chưa có hồ sơ nào. Tạo hồ sơ ngay{" "}
            <Link
              href="/user?tag=add-patient-profile"
              className="text-blue-500"
            >
              tại đây
            </Link>
            .
          </p>
        )}
      </div>
    </ColorBox>
  );
}
