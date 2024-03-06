import { HospitalManager, ResManagerAdmin, Staff } from "@/models";
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

const { confirm } = Modal;

export const schemaAcademicDegree = yup.object().shape({
  name: yup.string().required("Bạn chưa điền tên học vị."),
});
export interface BodyManagerAdminHealthProps {
  hospitalManagerViewer: ResManagerAdmin | null | undefined;
  refresh: () => void;
}

export function BodyManagerAdminHealth({
  hospitalManagerViewer,
  refresh,
}: BodyManagerAdminHealthProps) {
  const [managerEdit, setManagerEdit] = useState<HospitalManager | null>(null);
  const [staffIdSearch, setStaffIdSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [staffSearch, setStaffSearch] = useState<Staff[] | null>(null);

  const [isAcctiveToggle, setIsAcctiveToggle] = useState<boolean>(
    !!managerEdit?.isAcctive
  );

  const { isOpen, onOpen, onClose } = useDisclosure({ id: "1" });
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure({ id: "2" });

  function handleClickEdit(manager: HospitalManager) {
    setManagerEdit(manager);
    onOpen();
  }

  //
  function handleClickAdd() {
    onOpenAdd();
  }

  function handleChangeRadio(e: ChangeEvent<HTMLInputElement>) {
    setStaffIdSearch(e.target.value);
  }

  function handleClickDeleteAdmin(record: HospitalManager): void {
    confirm({
      title: `Bạn có muốn xóa admin ${record.Staff.fullName}`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.Staff.fullName}" 
      và không thể khôi phục`,
      async onOk() {
        const api = adminApi.deleteHospitalManager(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && refresh();
        return isOk;
      },
      onCancel() {},
    });
  }

  async function handleSubmitEdit() {
    setIsLoading(true);
    const api = adminApi.createOrUpdateHospitalManager({
      id: managerEdit?.id,
      isAcctive: isAcctiveToggle,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      refresh();
      onClose();
    }
    setIsLoading(false);
    return isOk;
  }

  async function handleSubmitAdd() {
    setIsLoading(true);
    const api = adminApi.createOrUpdateHospitalManager({
      staffId: staffIdSearch,
      healthFacilityId: hospitalManagerViewer?.healthFacility.id,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      refresh();
      onCloseAdd();
    }
    setIsLoading(false);
    return isOk;
  }

  function handleChangeToggle(isSelected: boolean) {
    setIsAcctiveToggle(isSelected);
  }

  const fetchStaff = useCallback(async (email?: string | undefined) => {
    const res = await staffApi.getStaff({ type: "hospital_manager", email });
    if (res.statusCode === 0 || res.statusCode === 200) {
      console.log("res", res);
      setStaffSearch(res.data?.rows);
    }
  }, []);

  async function handleSearchEmail(emailSearch: string) {
    await fetchStaff(emailSearch);
  }

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return (
    <div className="pt-4 text-black">
      <ModalFadeInNextUi
        id="1"
        isLoading={isLoading}
        handleSubmit={handleSubmitEdit}
        body={
          <div className="">
            <div className="flex items-center justify-between gap-2">
              <User
                avatarProps={{ radius: "lg" }}
                description={`admin|${managerEdit?.Staff.email}`}
                name={`${managerEdit?.Staff.fullName}`}
              >
                {managerEdit?.Staff.fullName}
              </User>
              <Switch
                defaultSelected={false || managerEdit?.isAcctive}
                onValueChange={handleChangeToggle}
              >
                Hoạt động
              </Switch>
            </div>
          </div>
        }
        show={isOpen}
        toggle={onClose}
        title="Sửa quyền"
      />

      <ModalFadeInNextUi
        size="2xl"
        title="Thêm quản lý"
        id="2"
        isLoading={isLoading}
        handleSubmit={handleSubmitAdd}
        contentBtnSubmit="Thêm"
        body={
          <div className="">
            <Input
              label="Tìm kiếm nhân viên"
              isClearable
              radius="lg"
              onChange={debounce(function (e) {
                handleSearchEmail(e.target.value);
              }, 300)}
              classNames={{
                label: "text-black/50 text-base",
                input: [],
                // innerWrapper: "bg-transparent",
                inputWrapper: [],
              }}
              placeholder="Nhập email nhân viên..."
              startContent={
                <SearchIcon className="text-black/50 mb-0.5 text-slate-400 pointer-events-none flex-shrink-0" />
              }
            />
            {staffSearch && staffSearch.length > 0 ? (
              <RadioGroup
                value={staffIdSearch}
                onChange={handleChangeRadio}
                className="mt-4 w-full min-h-[200px]"
                label="Danh sách nhân viên"
                description="Mỗi nhân viên chỉ được chọn làm quản lý trong một cơ sở y tế."
              >
                {staffSearch.map((s) => (
                  <RadioSearchEmailStar
                    key={s.id}
                    value={s.id}
                    className="w-full"
                  >
                    <User
                      avatarProps={{ radius: "lg" }}
                      description={`${s.email}`}
                      name={`${s.fullName}`}
                    >
                      {s.fullName}
                    </User>
                  </RadioSearchEmailStar>
                ))}
              </RadioGroup>
            ) : (
              <div className="flex items-center justify-center">
                <Chip
                  endContent={<NotificationIcon size={18} />}
                  variant="flat"
                  className="mt-4 "
                  color="secondary"
                >
                  Không tìm thấy!
                </Chip>
              </div>
            )}
          </div>
        }
        show={isOpenAdd}
        toggle={onCloseAdd}
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
                className="object-cover"
                height={200}
                shadow="md"
                src={hospitalManagerViewer?.healthFacility?.images[0] || ""}
                width="100%"
              />
            </div>

            <div className="flex  flex-col col-span-6 md:col-span-8">
              <div className="flex justify-start items-start">
                <div className="flex flex-col gap-0">
                  <h3 className="font-semibold text-lg text-foreground/90">
                    {hospitalManagerViewer?.healthFacility?.name}
                  </h3>
                  <p className="text-small text-foreground/80">
                    {hospitalManagerViewer?.healthFacility?.address}
                  </p>
                  <h1 className="text-large font-medium mt-2">
                    <Tag color="blue">
                      {hospitalManagerViewer?.healthFacility?.phone}
                    </Tag>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      <AdminManagerBox
        manager={hospitalManagerViewer?.manager}
        handleClickEdit={handleClickEdit}
        handleClickAdd={handleClickAdd}
        handleClickDelete={handleClickDeleteAdmin}
      />
    </div>
  );
}
