"use client";
import * as React from "react";
import { TableSortFilter } from "../table";
import { Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import useSWR from "swr";
import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/contrains-api";
import { HealthFacility, TypeHealthFacility } from "@/models";
import moment from "moment";
import { ActionBox, ActionGroup } from "../box";
export interface HealthFacilitiesBoxProps {}
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

export interface HealthFacilityRes extends HealthFacility {
  TypeHealthFacility: {
    name: string;
  };
}

export interface HealthFacilityColumns extends HealthFacility {
  typeHealthFacility: string;
}

export interface ResHealthFacilitiesBox {
  count: string;
  rows: HealthFacilityRes[];
}
export function HealthFacilitiesBox(props: HealthFacilitiesBoxProps) {
  const {
    data: healthFacilities,
    isLoading,
    error,
  } = useSWR<ResHealthFacilitiesBox>(`${API_HEALTH_FACILITIES}`, {
    dedupingInterval: 5000,
  });
  const {
    data: types,
    mutate: mutateTypeHealth,
    isLoading: loadingType,
  } = useSWR(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  //HealthFacilityColumns
  const columns: ColumnsType<HealthFacilityColumns> = React.useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => <a>{text}</a>,
        width: "16%",
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Loại",
        dataIndex: "typeHealthFacility",
        key: "typeHealthFacility",
        filters: types
          ? types.map((type: Partial<TypeHealthFacility>) => ({
              text: type.name,
              value: type.name,
            }))
          : [],
        onFilter: (value: string | number | boolean, record) => {
          return record.typeHealthFacility == value;
        },
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Tạo ngày",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{moment(text).locale("vi").calendar()}</a>,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <ActionGroup className="justify-start">
            <ActionBox type="edit" onClick={() => console.log("edit")} />
            <ActionBox type="delete" onClick={() => console.log("delete")} />
          </ActionGroup>
        ),
      },
    ],
    [types]
  );

  const data = React.useMemo<Partial<HealthFacility>[]>(() => {
    if (!healthFacilities?.rows) return [];
    return healthFacilities?.rows.map((row) => ({
      key: row.id,
      id: row.id,
      name: row.name,
      address: row.address,
      typeHealthFacility: row.TypeHealthFacility.name,
      createdAt: row.createdAt,
    }));
  }, [healthFacilities?.rows, healthFacilities]);

  return (
    <div className="gr-admin col-span-12">
      <TableSortFilter
        options={{ sticky: true, loading: isLoading }}
        columns={columns}
        data={data}
      />
    </div>
  );
}
