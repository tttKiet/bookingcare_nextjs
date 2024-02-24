import { ColorBox } from "@/components/box";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { HealthExaminationSchedule, PatientProfile, WorkRoom } from "@/models";
import { Button, Descriptions, DescriptionsProps, Table } from "antd";
import moment from "moment";
import { useMemo } from "react";

export interface IComfirmInformationProps {
  schedule: Partial<HealthExaminationSchedule> | null;
  patientProfile: PatientProfile | null;
  checkupInfo: WorkRoom | null;
  descStatusPatient: string;
  previous: () => void;
  next: (step: number, value: any) => void;
}

export function ComfirmInformation({
  schedule,
  patientProfile,
  previous,
  checkupInfo,
  next,
  descStatusPatient,
}: IComfirmInformationProps) {
  function handleClickConfirm() {
    next(4, "");
  }
  const dataSource = useMemo(
    () => [
      {
        key: "1",
        "#": "1",
        specialist: schedule?.Working?.Staff.Specialist.name,
        doctor: schedule?.Working?.Staff.fullName || "",
        time:
          schedule?.TimeCode?.value +
          ", ngày " +
          moment(schedule?.date).format("DD-MM-YYYY"),
        price: checkupInfo?.checkUpPrice.toLocaleString() + " vnđ",
      },
    ],
    [schedule]
  );

  const columns = [
    {
      title: "#",
      dataIndex: "#",
      key: "#",
    },
    {
      title: "Chuyên khoa",
      dataIndex: "specialist",
      key: "specialist",
    },
    {
      title: "Bác sỉ",
      dataIndex: "doctor",
      key: "doctor",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Tiền khám",
      dataIndex: "price",
      key: "price",
    },
  ];

  const { address } = useGetAddress({
    wardCode: patientProfile?.addressCode[0] || "",
    districtCode: patientProfile?.addressCode[1] || "",
    provinceCode: patientProfile?.addressCode[2] || "",
  });

  const items: DescriptionsProps["items"] = useMemo(
    () => [
      {
        key: "1",
        label: "Họ và tên",
        children: patientProfile?.fullName,
      },
      {
        key: "2",
        label: "Căn cước CD",
        children: patientProfile?.cccd,
      },
      {
        key: "3",
        label: "Email",
        children: patientProfile?.email,
      },
      {
        key: "4",
        label: "Giới tính",
        children: patientProfile?.gender === "male" ? "Nam" : "Nữ",
      },
      {
        key: "5",
        label: "Số điện thoại",
        children: patientProfile?.phone,
      },
      {
        key: "6",
        label: "Ngày sinh",
        children: moment(patientProfile?.birthDay).format("L"),
      },
      {
        key: "7",
        label: "Dân tộc",
        children: patientProfile?.nation,
      },
      {
        key: "8",
        label: "Địa chỉ",
        children: address,
      },
    ],
    [patientProfile, address]
  );
  return (
    <>
      <ColorBox title="Xác nhận thông tin khám" className="">
        <Table
          bordered={false}
          rootClassName="bg-transparent"
          className="bg-transparent"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </ColorBox>
      <ColorBox title="Thông tin bệnh nhân" className="mt-8">
        <Descriptions className="pt-3" size={"middle"} items={items} />
        <hr />
        <Descriptions className="pt-3" size={"middle"}>
          <Descriptions.Item label="Lý do khám / Tình trạng sức khỏe">
            {descStatusPatient}
          </Descriptions.Item>
        </Descriptions>
      </ColorBox>
      <div className="flex justify-end gap-4 py-5">
        <Button type="dashed" onClick={previous}>
          Trở lại
        </Button>
        <Button type={"primary"} onClick={handleClickConfirm}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}
