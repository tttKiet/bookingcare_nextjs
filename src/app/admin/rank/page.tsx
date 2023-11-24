"use client";

import { API_ADMIN_RANK } from "@/api-services/constant-api";
import { ManagerCode } from "@/components/admin-box";
import { TableSortFilter } from "@/components/table";
import { Select, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import * as React from "react";
import useSWR from "swr";
export interface Rank {
  name: string;
  total: number;
}
export default function CodeAdminPage() {
  const { data: ranks } = useSWR<Rank[]>(API_ADMIN_RANK);

  const data = ranks
    ?.map((r) => {
      return {
        key: r.name,
        ...r,
      };
    })
    .sort((a, b) => {
      return b.total - a.total;
    });
  const columns: ColumnsType<Rank> = React.useMemo(() => {
    return [
      {
        title: "Tên cơ sỏ y tế",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Tổng doanh thu",
        dataIndex: "total",
        key: "total",
        render: (text) => <a>{text.toLocaleString()} vnđ</a>,
      },
    ];
  }, []);
  console.log(data);
  return (
    <div className="p-4">
      <TableSortFilter
        options={{
          pagination: {
            total: data?.length || 4,
            pageSize: 5,
          },
          showSorterTooltip: false,
        }}
        columns={columns}
        data={data || []}
      />
    </div>
  );
}
