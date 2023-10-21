"use client";

import * as React from "react";
import { useRouter } from "next/router";
import { HealthRecord } from "@/models";
import { API_HEALTH_RECORD } from "@/api-services/constant-api";
import useSWR from "swr";
import { Breadcrumb } from "antd";
import { ColorBox } from "@/components/box";
import { HealthRecordItem } from "@/components/common";
export interface IHealthRecordPageProps {}

export default function HealthRecordPage(props: IHealthRecordPageProps) {
  const { data: resHealthRecords, error } = useSWR<HealthRecord[]>(
    `${API_HEALTH_RECORD}`,
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
    ],
    []
  );

  return (
    <div className="flex justify-center mb-10">
      <div className="container">
        <Breadcrumb style={{ margin: "32px 0" }} items={breadcrumbArray} />
        <ColorBox titlePosition="left" title="Danh sách phiếu khám bệnh">
          <div className="grid grid-cols-12 gap-y-16  py-10">
            {resHealthRecords?.map((record) => (
              <div
                key={record.id}
                className="col-span-12 md:col-span-6 flex justify-center"
              >
                <HealthRecordItem healthRecord={record} />
              </div>
            ))}
          </div>
        </ColorBox>
      </div>
    </div>
  );
}
