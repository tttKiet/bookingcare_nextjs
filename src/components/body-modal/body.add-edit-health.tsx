import { API_TYPE_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { schemaHealthFacilityBody } from "@/schema-validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { UploadFile } from "antd";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { InputField, InputTextareaField, InputUploadField } from "../form";

import { AiOutlinePhone } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { GiHospitalCross } from "react-icons/gi";
import { GoRepoForked } from "react-icons/go";
import { MdOutlineMail } from "react-icons/md";
import { HealthFacilityColumns } from "../admin-box";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { SelectFieldNext } from "../form/SelectFieldNext";
import { AddressCodeOption } from "./BodyAddEditPatient";
import axios from "axios";
import toast from "react-hot-toast";
import { Divider } from "@nextui-org/react";

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
    formState: { isSubmitting, defaultValues, isValid },
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

  const [optionProvinces, setOptionProvinces] = useState<
    AddressCodeOption[] | undefined
  >([]);
  const [optionDistricts, setOptionDistricts] = useState<
    AddressCodeOption[] | undefined
  >();

  const [optionWards, setOptionWards] = useState<
    AddressCodeOption[] | undefined
  >();

  function onChangeSelectProvince(value: string) {
    setValue("ward", "");
    setValue("district", "");
    setOptionDistricts([]);
    setOptionWards([]);
    axios
      .get(`https://vapi.vnappmob.com/api/province/district/${value}`)
      .then((data) => {
        const options = data.data.results.map((e: any) => {
          return {
            label: e.district_name.toString(),
            value: e.district_id.toString(),
          };
        });
        console.log("option trend", options);
        setOptionDistricts([...options]);
      })
      .catch((err) => {
        toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
        setValue("district", "");
        setValue("ward", "");
      });
  }

  function onChangeSelectDistrict(value: string): void {
    setValue("ward", "");
    setOptionWards([]);

    axios
      .get(`https://vapi.vnappmob.com/api/province/ward/${value}`)
      .then((data) => {
        setOptionWards(
          data.data.results.map((e: any) => {
            return {
              label: e.ward_name.toString(),
              value: e.ward_id.toString(),
            };
          })
        );
      })
      .catch((err) => {
        toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
        setValue("ward", "");
        setOptionWards([]);
      });
  }

  // get province
  useEffect(() => {
    axios
      .get("https://vapi.vnappmob.com/api/province")
      .then((data) => {
        const options = data.data.results.map((e: any) => {
          return {
            label: e.province_name.toString(),
            value: e.province_id.toString(),
          };
        });

        // console.log("options", options);

        setOptionProvinces([...options]);
      })
      .catch((err) => {
        console.log("err", err);
        toast("Lỗi lấy api tỉnh thành [Tinh]. Vui lòng nhấn F5 tải lại!");
      });
  }, []);

  useEffect(() => {
    if (obEditHealthFacility) {
      console.log("obEditHealthFacility", obEditHealthFacility);
      axios
        .get(
          `https://vapi.vnappmob.com/api/province/district/${obEditHealthFacility?.addressCode?.[2]}`
        )
        .then((data) => {
          const options = data.data.results.map((e: any) => {
            return {
              label: e.district_name.toString(),
              value: e.district_id.toString(),
            };
          });
          console.log("disc", data);
          setOptionDistricts(options);
        })
        .catch((err) => {
          toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
          setValue("district", "");
          setValue("ward", "");
        });
      axios
        .get(
          `https://vapi.vnappmob.com/api/province/ward/${obEditHealthFacility?.addressCode?.[1]}`
        )
        .then((data) => {
          setOptionWards(
            data.data.results.map((e: any) => {
              return { label: e.ward_name, value: e.ward_id };
            })
          );
          // setValue("ward", res.data.addressCode[0]);
        })
        .catch((err) => {
          console.log("err", err);
          toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
          setValue("ward", "");
        });
      setValue("province", obEditHealthFacility?.addressCode?.[2] || "");
      reset({
        name: obEditHealthFacility?.name || "",
        address: obEditHealthFacility?.address || "",
        phone: obEditHealthFacility?.phone || "",
        email: obEditHealthFacility?.email || "",
        typeHealthFacilityId: obEditHealthFacility?.typeHealthFacilityId || "",
        district: obEditHealthFacility?.addressCode?.[1],
        ward: obEditHealthFacility?.addressCode?.[0],
        province: obEditHealthFacility?.addressCode?.[2],
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
    }
  }, [obEditHealthFacility?.id, obEditHealthFacility]);

  async function handleSubmitLocal({
    name,
    email,
    phone,
    address,
    typeHealthFacilityId,
    files,
    district,
    province,
    ward,
  }: any) {
    const addressCode = [ward, district, province];
    console.log("addressCode", addressCode);
    const isOk = await handleSubmitForm({
      name,
      email,
      phone,
      address,
      typeHealthFacilityId,
      files,
      addressCode,
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
  const headingClass = "text-black font-bold";
  const options = types.map((t: TypeHealthFacility) => ({
    value: t.id,
    label: t.name,
  }));
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div className="overflow-y-auto max-h-[500px] px-1">
        <div>
          <h3 className={`mb-4 ${headingClass}`}>Thông tin cơ bản</h3>

          <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1">
            <InputField
              control={control}
              label="Tên cơ sở y tế"
              name="name"
              placeholder="Nhập tên cơ sở y tế"
              icon={<GiHospitalCross />}
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
          </div>
        </div>
        <Divider className="my-6" />

        <div>
          <h3 className={`mb-4 ${headingClass}`}>Loại cơ sở</h3>
          <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1">
            <SelectFieldNext
              control={control}
              icon={<GoRepoForked />}
              width={180}
              label="Loại cơ sở y tế"
              name="typeHealthFacilityId"
              options={[
                { value: "", label: "Chọn loại bệnh viện" },
                ...options,
              ]}
            />
          </div>
        </div>
        <Divider className="my-6" />

        <div>
          <h3 className={`mb-4 ${headingClass}`}>Định vị</h3>
          <div className="grid md:grid-cols-3 gap-3 sm:grid-cols-1">
            <div className="col-span-3">
              <InputTextareaField
                control={control}
                label="Địa chỉ"
                name="address"
                placeholder="Nhập địa chỉ"
                icon={<CiLocationOn />}
              />
            </div>

            <SelectFieldNext
              onChangeCustom={onChangeSelectProvince}
              control={control}
              name="province"
              placeholder="Chọn tỉnh"
              label="Tỉnh"
              isRequired
              options={optionProvinces || []}
            />

            <SelectFieldNext
              onChangeCustom={onChangeSelectDistrict}
              control={control}
              name="district"
              placeholder="Chọn quận, huyện"
              label="Quận, huyện"
              isRequired
              options={optionDistricts || []}
            />

            <SelectFieldNext
              control={control}
              name="ward"
              placeholder="Chọn xã, phường"
              label="Xã, phường"
              isRequired
              options={optionWards || []}
            />
          </div>
        </div>
        <Divider className="my-6" />

        <div>
          <h3 className={`mb-4 ${headingClass}`}>Hình ảnh</h3>

          <div className="">
            <InputUploadField
              resetFiles={handleResetFiles}
              fileExisted={obEditHealthFacility?.images || null}
              // col={2}
              control={control}
              label="Ảnh"
              name="files"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button color="primary" isLoading={isSubmitting} type="submit">
          {obEditHealthFacility?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
