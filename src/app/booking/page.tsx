"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import StepBookings from "@/components/steps/steps-booking,";
import { StepProps, TabPaneProps, Tabs } from "antd";
import { ColorBox } from "@/components/box";
import { HealthFacility } from "@/models";
import useSWR from "swr";
import { API_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Link from "next/link";
import { ChooseDoctor } from "@/components/common/step-boking";
export interface IAboutPageProps {}

export default function Booking(props: IAboutPageProps) {
  const searchParams = useSearchParams();
  const [current, setCurrent] = React.useState<number>(1);

  const healthFacilityId = searchParams.get("healthFacilityId");
  console.log("healthFacilityId", healthFacilityId);

  // Check effect of health facility
  const { data: healthFacility } = useSWR<ResDataPaginations<HealthFacility>>(
    `${API_HEALTH_FACILITIES}?id=${healthFacilityId}`
  );

  const tabItems: any[] = React.useMemo(() => {
    return [
      {
        label: `Cơ sở y tế`,
        key: "1",
        children: (
          <div className="flex items-center justify-center ">
            <Link className="text-blue-600" href="/health-facility">
              Vui lòng chọn cơ sở khám bệnh
            </Link>
          </div>
        ),
      },
      {
        label: `Chọn bác sỉ`,
        key: "2",
        children: <ChooseDoctor healthFacilityId={healthFacilityId} />,
      },
    ];
  }, []);
  const [infoCheckupItems, setInfoCheckupItems] = React.useState<StepProps[]>([
    {
      title: "Cơ sở y tế",
      description: "Chưa chọn",
    },
  ]);
  React.useEffect(() => {
    if (healthFacility) {
      setInfoCheckupItems(() => {
        return [
          {
            title: "Cơ sở y tế",
            description: (
              <div>
                <h5>{healthFacility.rows?.[0].name}</h5>
                <p>
                  <HiOutlineLocationMarker /> {healthFacility.rows?.[0].address}
                </p>
              </div>
            ),
          },
        ];
      });
      setCurrent(2);
    }
  }, [healthFacility]);

  return (
    <div className="py-8 flex justify-center bg-blue-100/40">
      <div className="container">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-4">
            <ColorBox title="Thông tin khám" className="min-h-[200px]">
              <StepBookings
                // onChange={onChangeSteps}
                items={infoCheckupItems}
              />
            </ColorBox>
          </div>

          <div className="col-span-8">
            <ColorBox title={false} className="min-h-[400px]">
              <Tabs activeKey={current.toString()} items={tabItems} />
            </ColorBox>
          </div>
        </div>
      </div>
    </div>
  );
}
