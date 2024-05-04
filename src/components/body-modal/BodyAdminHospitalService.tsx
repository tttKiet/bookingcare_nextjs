import {
  HospitalService,
  ResAdminManagerHospitalService,
  ResManagerAdmin,
  Staff,
} from "@/models";
import {
  Card,
  CardBody,
  Chip,
  Divider,
  Image,
  Input,
  Switch,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { RadioGroup, Radio, cn } from "@nextui-org/react";
import debounce from "lodash.debounce";
import { Modal, Tag } from "antd";

import * as yup from "yup";
import AdminManagerBox from "../admin-box/AdminManagerBox";
import { ModalFadeInNextUi } from "../modal/ModalFadeInNextUi";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { adminApi, staffApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { SearchIcon } from "../icons/SearchIcon";
import RadioSearchEmailStar from "../common/RadioSearchEmailStar";
import { NotificationIcon } from "../icons/NotificationIcon";
import AdminHospitalServiceBox from "../admin-box/AdminHospitalServiceBox";
import { BodyManagerHospitalService } from "./BodyManagerHospitalService";

const { confirm } = Modal;

export const schemaAcademicDegree = yup.object().shape({
  name: yup.string().required("Bạn chưa điền tên học vị."),
});
export interface BodyAdminHospitalServiceProps {
  viewer: ResAdminManagerHospitalService | null | undefined;
  refresh: () => void;
}

export function BodyAdminHospitalService({
  viewer,
  refresh,
}: BodyAdminHospitalServiceProps) {
  const [managerEdit, setManagerEdit] = useState<HospitalService | null>(null);
  const [staffIdSearch, setStaffIdSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffSearch, setStaffSearch] = useState<Staff[] | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleClickEdit(manager: HospitalService) {
    setManagerEdit(manager);
    onOpen();
  }

  //
  function handleClickAdd() {
    // setManagerEdit(null);
    onOpen();
  }

  function handleClickDeleteAdmin(record: HospitalService): void {
    confirm({
      title: `Bạn có muốn xóa admin ${record.ExaminationService.name}`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.ExaminationService.name}"
      và không thể khôi phục`,
      async onOk() {
        const api = adminApi.deleteHospitalService({
          healthFacilityId: record.healthFacilityId,
          examinationServiceId: record.examinationServiceId,
        });
        const isOk = await toastMsgFromPromise(api);
        isOk && refresh();
        return isOk;
      },
      onCancel() {},
    });
  }

  async function handleSubmitAdd(
    data: Partial<HospitalService>
  ): Promise<boolean> {
    setIsLoading(true);
    const api = adminApi.createOrUpdateHospitalService({
      healthFacilityId: viewer?.healthFacility.id,
      ...data,
    });
    const isOk = await toastMsgFromPromise(api);

    if (isOk) {
      setManagerEdit(null);
      refresh();
      onClose();
    }
    setIsLoading(false);
    return isOk;
  }

  return (
    <div className="py-6 pt-2 text-black">
      <ModalFadeInNextUi
        id="1"
        isLoading={isLoading}
        size="lg"
        body={
          <BodyManagerHospitalService
            clickCancel={onClose}
            handleSubmitForm={handleSubmitAdd}
            obEdit={managerEdit}
          />
        }
        footer={false}
        show={isOpen}
        toggle={onClose}
        title={managerEdit ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ"}
      />

      <Card
        isBlurred
        className="mb-4 border-none bg-background/60 dark:bg-default-100/50 "
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-start justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                isZoomed
                alt="Album cover"
                height={190}
                shadow="md"
                className={"w-[190px] h-[190px] object-cover"}
                src={viewer?.healthFacility?.images[0] || ""}
                width="100%"
              />
            </div>

            <div className="flex  flex-col col-span-6 md:col-span-8">
              <div className="flex justify-start items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-lg text-foreground/90">
                    {viewer?.healthFacility?.name}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {viewer?.healthFacility?.address}
                  </p>
                  <h1 className="text-large font-medium mt-2">
                    <Tag color="blue">{viewer?.healthFacility?.phone}</Tag>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <AdminHospitalServiceBox
        manager={viewer?.service}
        handleClickEdit={handleClickEdit}
        handleClickAdd={handleClickAdd}
        handleClickDelete={handleClickDeleteAdmin}
      />
    </div>
  );
}
