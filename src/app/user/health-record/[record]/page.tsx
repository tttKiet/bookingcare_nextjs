"use client";

import {
  API_HEALTH_FACILITIES,
  API_HEALTH_RECORD,
} from "@/api-services/constant-api";
import { ColorBox } from "@/components/box";
import { HealthRecordItemDetails } from "@/components/common";
import { HealthRecord } from "@/models";
import { Breadcrumb } from "antd";
import * as React from "react";
import useSWR from "swr";
export interface IHealthRecordDetailPageProps {}

export default function HealthRecordPageDetail({
  params,
}: {
  params: { record: string };
}) {
  const {
    data: resHealthRecord,
    error,
    mutate,
  } = useSWR<HealthRecord>(
    `${API_HEALTH_RECORD}?healthRecordId=${params.record}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const breadcrumbArray = React.useMemo(
    () => [
      { title: "Trang chủ" },
      {
        title: "Phiếu khám bệnh",
      },
      {
        title: "Chi tiết phiếu khám bệnh",
      },
    ],
    []
  );

  return (
    <div className="flex justify-center mb-10">
      <div className="container">
        <Breadcrumb style={{ margin: "32px 0" }} items={breadcrumbArray} />
        <ColorBox titlePosition="left" title="Thông tin phiếu khám bệnh">
          <div className="flex justify-center">
            <HealthRecordItemDetails
              fetchData={mutate}
              healthRecord={resHealthRecord}
            />
          </div>
        </ColorBox>
      </div>
    </div>
  );
}
