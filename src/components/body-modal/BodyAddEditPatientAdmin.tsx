"use client";

import { HealthFacility, Patient, PatientProfile } from "@/models";

import { useForm } from "react-hook-form";
import { InputField, SelecSearchOptionProps, SelectSearchField } from "../form";
import axiosInstances from "../../axios";

import { Button } from "@nextui-org/button";
import {
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CgRename } from "react-icons/cg";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  schemaCedicineBody,
  schemaPatientAdminBody,
  schemaPatientBody,
} from "@/schema-validate";
import { RadioGroupNextUi } from "../form/RadioGroupNextUi";
import { SelectFieldNext } from "../form/SelectFieldNext";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import useSWR, { BareFetcher } from "swr";
import { ResDataPaginations } from "@/types";
import { API_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { Image } from "@nextui-org/image";
import { SelectControl } from "../form/SelectControl";

export interface AddressCodeOption {
  label: string;
  value: string;
}

export interface BodyAddEditPatientAdminProps {
  handleSubmitForm: (data: Partial<Patient>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  patientProfileId?: string;
  obEditPatient: Partial<Patient> | undefined;
  getInfoFromProfile?: () => PatientProfile | undefined;
}

export function BodyAddEditPatientAdmin({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditPatient,
  getInfoFromProfile,
}: BodyAddEditPatientAdminProps) {
  const [selectHealthValue, setSelectHealthValue] = useState<string | null>(
    null
  );
  const [searchHealthSelect, setSearchHealthSelect] = useState<string>("");
  const fetcher: BareFetcher<ResDataPaginations<any>> = async ([url, token]) =>
    (
      await axiosInstances.get(url, {
        params: {
          ...token,
        },
      })
    ).data;

  // Search health
  const { data: responseHealthFacilities, mutate: mutateHealthFacilities } =
    useSWR<ResDataPaginations<HealthFacility>>(
      [
        API_HEALTH_FACILITIES,
        {
          name: searchHealthSelect,
        },
      ],
      fetcher,
      {
        revalidateOnMount: true,
        dedupingInterval: 5000,
      }
    );

  const dataSearch: SelecSearchOptionProps[] =
    responseHealthFacilities?.rows.map((healh: HealthFacility) => ({
      value: healh.id,
      startContent: (
        <Image
          className="rounded-full border-spacing-8 border  border-blue-400  object-cover w-[44px] h-[42px]"
          alt="Health Facility"
          width={44}
          height={44}
          src={healh?.images?.[0] || ""}
        />
      ),
      description: (
        <div className="flex align-top gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between gap-x-4">
              <span className="text-xs font-normal text-blue-600">
                {healh.email}
              </span>
              <span className="text-xs font-normal text-right text-gray-500 max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden">
                {healh.address}
              </span>
            </div>
          </div>
        </div>
      ),
      label: healh.name,
    })) || [];

  function handleSearchSelect(value: string): void {
    setSearchHealthSelect(value);
  }

  function handleChangeSelect(value: string): void {
    setSelectHealthValue(value);
  }
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      phone: "",
      profession: "",
      email: "",
      gender: "",
      birthDay: "",
      nation: "",
      cccd: "",
    },
    resolver: yupResolver(schemaPatientAdminBody),
  });

  async function handleSubmitLocal(patient: Partial<Patient>) {
    const isOk = await handleSubmitForm({
      id: obEditPatient?.id || undefined,
      ...patient,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
  }

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

  useEffect(() => {
    if (obEditPatient) {
      axios
        .get(
          `https://vapi.vnappmob.com/api/province/district/${obEditPatient?.addressCode?.[2]}`
        )
        .then((data) => {
          const options = data.data.results.map((e: any) => {
            return {
              label: e.district_name.toString(),
              value: e.district_id.toString(),
            };
          });
          setOptionDistricts(options);
        })
        .catch((err) => {
          toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
          setValue("district", "");
          setValue("ward", "");
        });
      axios
        .get(
          `https://vapi.vnappmob.com/api/province/ward/${obEditPatient?.addressCode?.[1]}`
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
      setValue("province", obEditPatient?.addressCode?.[2] || "");
      setSearchHealthSelect(obEditPatient.HealthFacility?.name || "");
      reset({
        id: obEditPatient?.id || "",
        healthFacilityId: obEditPatient?.healthFacilityId || "",
        fullName: obEditPatient?.fullName || "",
        phone: obEditPatient?.phone || "",
        profession: obEditPatient?.profession || "",
        email: obEditPatient?.email || "",
        gender: obEditPatient?.gender || "",
        birthDay: obEditPatient?.birthDay
          ? moment(new Date(obEditPatient?.birthDay?.toString() || "")).format(
              "yyyy-MM-Do"
            )
          : "",
        nation: obEditPatient?.nation || "",
        cccd: obEditPatient?.cccd || "",
        district: obEditPatient?.addressCode?.[1],
        ward: obEditPatient?.addressCode?.[0],
        province: obEditPatient?.addressCode?.[2],
      });
    }
  }, [obEditPatient, obEditPatient?.id, reset]);

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

  const opGender = [
    {
      label: "Nam",
      value: "male",
    },
    {
      label: "Nữ",
      value: "famale",
    },
    {
      label: "Khác",
      value: "order",
    },
  ];

  const headingClass = "text-black font-bold";
  function err(data: any) {
    console.log("data", data);
  }
  return (
    <form onSubmit={handleSubmit(handleSubmitLocal, err)} className="">
      <div className="overflow-y-auto max-h-[500px] px-1">
        <div>
          <h3 className={`mb-4 ${headingClass}`}>Bệnh nhân ở cơ sở y tế</h3>
          <div className="grid grid-cols-12">
            <div className="col-span-6">
              <SelectControl
                label="Tìm kiếm cơ sở y tế"
                placeholder="Nhập tên cơ sơ y tế"
                data={dataSearch}
                name="healthFacilityId"
                handleSearchSelect={handleSearchSelect}
                control={control}
                isRequired
              />
            </div>
          </div>
        </div>
        <Divider className="my-6" />
        <div>
          <h3 className={`mb-4 ${headingClass}`}>Cá nhân</h3>
          <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-1">
            <InputField
              isRequired
              control={control}
              label="Tên bệnh nhân"
              name="fullName"
              placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />

            <InputField
              isRequired
              control={control}
              label="Nghề nghiệp"
              name="profession"
              // placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />

            <InputField
              isRequired
              control={control}
              label="Tôn giáo"
              name="nation"
              placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />

            <InputField
              isRequired
              control={control}
              label="Căn cước công dân"
              name="cccd"
              // placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />

            <InputField
              isRequired
              control={control}
              type="date"
              label="Ngày sinh"
              name="birthDay"
              placeholder="Chọn ngày sinh"
              icon={<CgRename />}
            />
            <div className="col-span-3">
              <RadioGroupNextUi
                label="Giới tính"
                name="gender"
                control={control}
                options={opGender}
              />
            </div>
          </div>
        </div>
        <Divider className="my-6" />
        <div>
          <h3 className={`my-4 ${headingClass}`}>Liên hệ</h3>

          <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-1">
            <InputField
              isRequired
              control={control}
              label="Số điện thoại"
              name="phone"
              // placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />

            <InputField
              isRequired
              control={control}
              label="Email"
              name="email"
              // placeholder="Nhập tên bệnh nhân"
              icon={<CgRename />}
            />
          </div>
        </div>
        <Divider className="my-6" />

        <div>
          <h3 className={`my-4 ${headingClass}`}>Nơi ở</h3>

          <div className="grid md:grid-cols-3 gap-4 sm:grid-cols-1">
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
      </div>
      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        <Button color="danger" variant="light" onClick={clickCancel}>
          Hủy
        </Button>

        <Button
          color="primary"
          // isDisabled={}
          isLoading={isSubmitting}
          type="submit"
        >
          {obEditPatient?.id ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
