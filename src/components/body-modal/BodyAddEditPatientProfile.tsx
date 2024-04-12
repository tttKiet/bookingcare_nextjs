import { Patient, PatientProfile } from "@/models";

import { useForm } from "react-hook-form";
import { InputField } from "../form";

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
import { schemaCedicineBody, schemaPatientBody } from "@/schema-validate";
import { RadioGroupNextUi } from "../form/RadioGroupNextUi";
import { SelectFieldNext } from "../form/SelectFieldNext";
import moment from "moment";
import axiosInstances from "../../axios";

interface AddressCodeOption {
  label: string;
  value: string;
}

export interface BodyAddEditPatientProfileProps {
  handleSubmitForm: (data: Partial<PatientProfile>) => Promise<boolean>;
  clickCancel: () => void;
  loading?: boolean;
  obEditPatient: Partial<PatientProfile> | undefined;
}

export function BodyAddEditPatientProfile({
  clickCancel,
  handleSubmitForm,
  loading,
  obEditPatient,
}: BodyAddEditPatientProfileProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      id: "",
      fullName: "",
      phone: "",
      profession: "",
      email: "",
      gender: "",
      birthDay: "",
      nation: "",
      cccd: "",
    },
    resolver: yupResolver(schemaPatientBody),
  });

  async function handleSubmitLocal(patient: Partial<PatientProfile>) {
    const isOk = await handleSubmitForm({
      // id: obEditPatient?.id || undefined,
      userId: obEditPatient?.userId,
      ...patient,
    });
    if (isOk) {
      control._resetDefaultValues();
      clickCancel();
    }
    return false;
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
    if (obEditPatient) {
      axiosInstances
        .get(
          `/api/v1/user/patient-profile?patientProfileId=${obEditPatient?.id}`
        )
        .then((res) => {
          axios
            .get(
              `https://vapi.vnappmob.com/api/province/district/${res.data.addressCode[2]}`
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
              `https://vapi.vnappmob.com/api/province/ward/${res.data.addressCode[1]}`
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
          setValue("province", res.data.addressCode[2]);
          return res.data;
        })
        .then(() => {
          console.log("obEditPatient.addressCode", obEditPatient.addressCode);
          reset({
            id: obEditPatient?.id || "",
            fullName: obEditPatient?.fullName || "",
            phone: obEditPatient?.phone || "",
            profession: obEditPatient?.profession || "",
            email: obEditPatient?.email || "",
            gender: obEditPatient?.gender || "",
            birthDay: obEditPatient?.birthDay
              ? moment(
                  new Date(obEditPatient?.birthDay?.toString() || "")
                ).format("yyyy-MM-Do")
              : "",
            nation: obEditPatient?.nation || "",
            cccd: obEditPatient?.cccd || "",
            district: obEditPatient?.addressCode?.[1],
            ward: obEditPatient?.addressCode?.[0],
            province: obEditPatient?.addressCode?.[2],
          });
        });
    }
  }, [obEditPatient, obEditPatient?.id, reset]);

  // useEffect(() => {
  //   if (obEditPatient)
  //     console.log(
  //       'moment(new Date(obEditPatient?.birthDay)).format("L")',
  //       moment(new Date(obEditPatient?.birthDay?.toString() || "")).format(
  //         "yyyy/MM/Do"
  //       )
  //     );
  //   reset({
  //     id: obEditPatient?.id || "",
  //     fullName: obEditPatient?.fullName || "",
  //     phone: obEditPatient?.phone || "",
  //     profession: obEditPatient?.profession || "",
  //     email: obEditPatient?.email || "",
  //     gender: obEditPatient?.gender || "",
  //     birthDay: obEditPatient?.birthDay
  //       ? moment(new Date(obEditPatient?.birthDay?.toString() || "")).format(
  //           "yyyy-MM-Do"
  //         )
  //       : "",
  //     nation: obEditPatient?.nation || "",
  //     cccd: obEditPatient?.cccd || "",
  //     // ward: obEditPatient?.addressCode?.[0] || "",
  //     // district: obEditPatient?.addressCode?.[1] || "",
  //     // province: obEditPatient?.addressCode?.[2] || "",
  //   });
  // }, [obEditPatient?.id, reset, ]);

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

  return (
    <form onSubmit={handleSubmit(handleSubmitLocal)} className="pt-4">
      <div>
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

        <Button color="primary" isLoading={isSubmitting} type="submit">
          {true ? "Lưu" : "Thêm"}
        </Button>
      </div>
    </form>
  );
}
