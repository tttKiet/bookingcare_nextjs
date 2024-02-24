"use client";

import { API_HEALTH_RECORD } from "@/api-services/constant-api";
import { HealthRecordItem } from "@/components/common";
import { HealthRecord } from "@/models";
import { Breadcrumb } from "antd";
import { useMemo } from "react";
import useSWR from "swr";
export interface IHealthRecordPageProps {}

export default function HealthRecordPage(props: IHealthRecordPageProps) {
  const { data: resHealthRecords, error } = useSWR<HealthRecord[]>(
    `${API_HEALTH_RECORD}`,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );
  const breadcrumbArray = useMemo(
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
      <div className="container h-screen">
        <Breadcrumb className="mt-[32px] mb-4" items={breadcrumbArray} />

        <h3 className="text-base mb-6">Danh sách phiếu khám bệnh</h3>
        <div className="grid grid-cols-12 gap-8 ">
          {resHealthRecords?.map((record) => (
            <div
              key={record.id}
              className="col-span-12 md:col-span-4 flex justify-center"
            >
              <HealthRecordItem healthRecord={record} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
