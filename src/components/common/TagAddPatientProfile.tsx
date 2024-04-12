"use client";

import { ColorBox } from "../box";
import { DatePicker, Form, Input, Radio, Select } from "antd";
import { FieldType } from "aws-sdk/clients/iot";
import axios from "axios";
import toast from "react-hot-toast";
import { DefaultOptionType } from "antd/es/select";
import { useRouter, useSearchParams } from "next/navigation";
import { PatientProfile } from "@/models";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import axiosInstances from "../../axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
export interface AddPatientProfileProps {}

interface SelectProps {
  label: string;
  value: string;
}

export function AddPatientProfile({}: AddPatientProfileProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientProfileId = searchParams.get("id");

  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [optionProvinces, setOptionProvinces] = useState<
    SelectProps[] | undefined
  >([]);
  const [optionDistricts, setOptionDistricts] = useState<
    SelectProps[] | undefined
  >();

  const [optionWards, setOptionWards] = useState<SelectProps[] | undefined>();

  function onChangeSelectProvince(value: string) {
    form.setFieldsValue({
      district: null,
      ward: null,
    });
    axios
      .get(`https://vapi.vnappmob.com/api/province/district/${value}`)
      .then((data) => {
        const options = data.data.results.map((e: any) => {
          return { label: e.district_name, value: e.district_id };
        });

        setOptionDistricts(options);
      })
      .catch((err) => {
        toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
        form.setFieldsValue({
          district: null,
          ward: null,
        });
      });
  }

  function onChangeSelectDistrict(value: string): void {
    form.setFieldsValue({
      ward: null,
    });
    axios
      .get(`https://vapi.vnappmob.com/api/province/ward/${value}`)
      .then((data) => {
        console.log(data);
        setOptionWards(
          data.data.results.map((e: any) => {
            return { label: e.ward_name, value: e.ward_id };
          })
        );
      })
      .catch((err) => {
        toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
        form.setFieldsValue({
          ward: null,
        });
      });
  }

  async function submitForm(values: any) {
    const data = {
      id: patientProfileId || "",
      fullName: values.fullName,
      phone: values.phone,
      profession: values.profession,
      email: values.email,
      gender: values.gender,
      birthDay: values.birthDay,
      nation: values.nation,
      cccd: values.cccd,
      addressCode: [values.ward, values.district, values.province],
      userId: values.id,
    };
    setIsLoading(true);
    const api = userApi.createOrUpdatePatientProfile(data);
    const isOk = await toastMsgFromPromise(api);
    setIsLoading(false);

    if (isOk) {
      router.push("/user?tag=patient-profile");
    }
  }
  useEffect(() => {
    axios
      .get("https://vapi.vnappmob.com/api/province")
      .then((data) => {
        const options = data.data.results.map((e: any) => {
          return { label: e.province_name, value: e.province_id };
        });

        // console.log("options", options);

        setOptionProvinces(options);
      })
      .catch((err) => {
        console.log("err", err);
        toast("Lỗi lấy api tỉnh thành [Tinh]. Vui lòng nhấn F5 tải lại!");
      });
  }, []);

  useEffect(() => {
    if (patientProfileId) {
      axiosInstances
        .get(
          `/api/v1/user/patient-profile?patientProfileId=${patientProfileId}`
        )
        .then((res) => {
          axios
            .get(
              `https://vapi.vnappmob.com/api/province/district/${res.data.addressCode[2]}`
            )
            .then((data) => {
              const options = data.data.results.map((e: any) => {
                return { label: e.district_name, value: e.district_id };
              });
              form.setFieldsValue({
                district: res.data.addressCode[1],
              });

              setOptionDistricts(options);
            })
            .catch((err) => {
              toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
              form.setFieldsValue({
                district: null,
                ward: null,
              });
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

              form.setFieldsValue({
                ward: res.data.addressCode[0],
              });
            })
            .catch((err) => {
              console.log("err", err);

              toast("Lỗi lấy api tỉnh thành. Vui lòng nhấn F5 tải lại!");
              form.setFieldsValue({
                ward: null,
              });
            });
          form.setFieldsValue({
            province: res.data.addressCode[2],
          });
          return res.data;
        })
        .then((data) => {
          form.setFieldsValue({
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            profession: data.profession,
            gender: data.gender,
            cccd: data.cccd,
            nation: data.nation,
            birthDay: dayjs(data.birthDay),
          });
        });
    }
  }, [patientProfileId, form]);

  return (
    <ColorBox title="Thêm hồ sơ bệnh nhân">
      <Form
        form={form}
        name="add-patient-profile"
        layout="vertical"
        initialValues={{}}
        onFinish={submitForm}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="pt-4"
      >
        <div className="grid grid-cols-12 gap-6 gap-y-0">
          <div className="col-span-12 text-left pb-2">
            Lưu ý: Các trường có dấu "
            <span className="text-[#ff4d4f] px-[1px] leading-[1] font-[SimSun,sans-serif] inline-block">
              *
            </span>
            " phải bắt buộc có!
          </div>
          <Form.Item<FieldType>
            label="Họ và tên"
            name="fullName"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập trường này!" }]}
          >
            <Input placeholder="Vd: Nguyen Van A" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Email!",
              },
              {
                type: "email",
                message: "Email của bạn không đúng định dạng!",
              },
            ]}
          >
            <Input placeholder="Vd: abc123@gmail.com" />
          </Form.Item>
          <Form.Item<FieldType>
            label="Số điện thoại"
            name="phone"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[
              { required: true, message: "Vui lòng điền số điện thoại!" },
              {
                pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                message: "Số điện thoại của bạn không đúng định dạng!",
              },
            ]}
          >
            <Input placeholder="VD: 0912345678" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Nghề nghiệp"
            name="profession"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập nghề nghiệp!" }]}
          >
            <Input placeholder="Nghề nghiệp của bạn..." />
          </Form.Item>
          <Form.Item<FieldType>
            label="Giới tính"
            name="gender"
            className="col-span-12 md:col-span-4"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
          >
            <Radio.Group>
              <Radio value="male"> Nam </Radio>
              <Radio value="famale"> Nữ </Radio>
              <Radio value="order"> Khác </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item<FieldType>
            label="Ngày sinh"
            name="birthDay"
            className="col-span-12 md:col-span-4"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Nhập ngày sinh của bạn!" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item<FieldType>
            label="Căn cước công dân"
            name="cccd"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập CCCD!" }]}
          >
            <Input placeholder="CCCD..." />
          </Form.Item>
          <Form.Item<FieldType>
            label="Dân tộc"
            name="nation"
            className="col-span-12 md:col-span-6"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập trường này!" }]}
          >
            <Input placeholder="Dân tộc..." />
          </Form.Item>
          <Form.Item<FieldType>
            label="Tỉnh"
            name="province"
            className="col-span-12 md:col-span-4"
            style={{ textAlign: "left" }}
            // validateTrigger={false}
            rules={[{ required: true, message: "Bạn chưa nhập trường này!" }]}
          >
            <Select
              showSearch
              placeholder="Chọn tỉnh"
              onChange={onChangeSelectProvince}
              virtual={false}
            >
              {optionProvinces?.map((d: any) => (
                <Select.Option key={d.value} value={d.value}>
                  {d.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<FieldType>
            label="Huyện"
            name="district"
            className="col-span-12 md:col-span-4"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập trường này!" }]}
          >
            <Select
              onChange={onChangeSelectDistrict}
              placeholder="Chọn huyện"
              virtual={false}
            >
              {optionDistricts?.map((d: any) => (
                <Select.Option key={d.value} value={d.value}>
                  {d.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item<FieldType>
            label="Phường, xã"
            name="ward"
            className="col-span-12 md:col-span-4"
            style={{ textAlign: "left" }}
            rules={[{ required: true, message: "Bạn chưa nhập trường này!" }]}
          >
            <Select placeholder="Chọn huyện" virtual={false}>
              {optionWards?.map((d: any) => (
                <Select.Option key={d.value} value={d.value}>
                  {d.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 my-4 mt-5">
          <Button
            color="default"
            type="button"
            onClick={() => {
              router.back();
            }}
            className="cursor-pointer"
            size="md"
          >
            Trở lại
          </Button>
          <Button
            color="primary"
            type="submit"
            isLoading={isLoading}
            size="md"
            className="cursor-pointer"
          >
            {patientProfileId ? "Sửa" : "Thêm"}
          </Button>
          {/* <Button onClick={previous} size="md">
            Trở lại
          </Button>
          <Button
            color={"primary"}
            size="md" 
            size="md"

            onClick={handleClickConfirm}
            className="cursor-pointer"
          >
            Tiếp tục
          </Button> */}
        </div>
      </Form>
    </ColorBox>
  );
}
