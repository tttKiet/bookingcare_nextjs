import { API_TYPE_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { schemaHealthFacilityBody } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Space, UploadFile } from "antd";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { InputField, InputUploadField, SelectField } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { GiHospitalCross } from "react-icons/gi";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMail } from "react-icons/md";
import { HealthFacilityColumns } from "../admin-box";
import { useEffect } from "react";

export interface BodyModalHealthProps {
  handleSubmitForm: (data: Partial<HealthFacilityClient>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditHealthFacility?: HealthFacilityColumns | null;
}

export interface HealthFacilityClient extends HealthFacility {
  files: Partial<UploadFile>[];
}

export default function BodyModalHealth({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditHealthFacility,
}: BodyModalHealthProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, defaultValues },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      typeHealthFacilityId: "",
      files: [],
    },
    resolver: yupResolver(schemaHealthFacilityBody),
  });

  useEffect(() => {
    reset({
      name: obEditHealthFacility?.name || "",
      address: obEditHealthFacility?.address || "",
      phone: obEditHealthFacility?.phone || "",
      email: obEditHealthFacility?.email || "",
      typeHealthFacilityId: obEditHealthFacility?.typeHealthFacilityId || "",
      files:
        obEditHealthFacility?.images.map((file, index) => {
          return {
            uid: `${file.split("/").pop()?.toString()}`,
            name: "image.png",
            status: "done",
            url: file,
            type: "image/jpeg",
          };
        }) || [],
    });
  }, [obEditHealthFacility?.id, obEditHealthFacility]);

  async function handleSubmitLocal({
    name,
    email,
    phone,
    address,
    typeHealthFacilityId,
    files,
  }: Partial<HealthFacilityClient>) {
    const isOk = await handleSubmitForm({
      name,
      email,
      phone,
      address,
      typeHealthFacilityId,
      files,
      id: obEditHealthFacility?.id,
    });
    if (isOk) {
      reset({
        name: "",
        address: "",
        phone: "",
        email: "",
        typeHealthFacilityId: "",
        files: [],
      });
      clickCancel();
    }
    return false;
  }

  const {
    data: types,
    mutate: mutateTypeHealth,
    isLoading: loadingType,
  } = useSWR(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  function handleResetFiles(fileArray: Array<any>): void {
    setValue("files", fileArray);
  }

  const options = types.map((t: TypeHealthFacility) => ({
    value: t.id,
    label: t.name,
  }));
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="grid md:grid-cols-2 gap-3 sm:grid-cols-1">
        <InputField
          control={control}
          label="Tên cơ sở y tế"
          name="name"
          placeholder="Nhập tên cơ sở y tế"
          icon={<GiHospitalCross />}
        />
        <InputField
          control={control}
          label="Địa chỉ"
          name="address"
          placeholder="Nhập địa chỉ"
          icon={<CiLocationOn />}
        />
        <InputField
          control={control}
          label="Số điện thoại của CSYT"
          name="phone"
          icon={<AiOutlinePhone />}
          placeholder="Nhập số điện thoại của CSYT"
        />
        <InputField
          control={control}
          label="Địa chỉ email liên hệ"
          icon={<MdOutlineMail />}
          name="email"
          placeholder="Nhập email liên hệ"
        />
        <SelectField
          control={control}
          icon={<GoRepoForked />}
          width={180}
          label="Loại cơ sở y tế"
          name="typeHealthFacilityId"
          options={[{ value: "", label: "Chọn loại bệnh viện" }, ...options]}
        />
        <InputUploadField
          resetFiles={handleResetFiles}
          fileExisted={obEditHealthFacility?.images || null}
          col={2}
          control={control}
          label="Ảnh"
          name="files"
        />
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 pt-[20px]">
        <Button type="default" size="middle" onClick={clickCancel}>
          Hủy
        </Button>
        <Space wrap>
          <Button
            type="primary"
            size="middle"
            loading={isSubmitting}
            // onClick={() => true}
            htmlType="submit"
          >
            {obEditHealthFacility?.id ? "Lưu" : "Thêm"}
          </Button>
        </Space>
      </div>
    </form>
  );
}
