"use client";
import * as React from "react";
import { TableSortFilter } from "../table";
import { Button, Input, InputRef, Space, Tag } from "antd";
import type {
  ColumnsType,
  ColumnType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import useSWR, { BareFetcher, Fetcher } from "swr";
import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/contrains-api";
import Highlighter from "react-highlight-words";
import { HealthFacility, TypeHealthFacility } from "@/models";
import moment from "moment";
import { ActionBox, ActionGroup } from "../box";
import { FilterConfirmProps } from "antd/es/table/interface";
import { BsSearch } from "react-icons/bs";
import axios from "../../axios";

export interface HealthFacilitiesBoxProps {}

export interface HealthFacilityRes extends HealthFacility {
  TypeHealthFacility: {
    name: string;
  };
}

export interface HealthFacilityColumns extends HealthFacility {
  typeHealthFacility: string;
}

type DataIndex = keyof HealthFacilityColumns;

export interface ResHealthFacilitiesBox {
  count: number;
  rows: HealthFacilityRes[];
}
export function HealthFacilitiesBox(props: HealthFacilitiesBoxProps) {
  const [queryParams, setQueryParams] = React.useState<
    Partial<HealthFacilityColumns>
  >({
    name: "",
    address: "",
    typeHealthFacility: "",
  });
  // Filter search
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);

  // Pagination
  const [tableParams, setTableParams] = React.useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });
  const handleTableChange: TableProps<HealthFacilityColumns>["onChange"] = (
    pagination,
    filters
  ) => {
    console.log("filters", filters);
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
    }));
    setTableParams({
      pagination,
    });
  };
  const fetcher: BareFetcher<ResHealthFacilitiesBox> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;

  const {
    data: healthFacilities,
    isLoading,
    error,
  } = useSWR<ResHealthFacilitiesBox>(
    [
      API_HEALTH_FACILITIES,
      {
        ...queryParams,
        limit: tableParams.pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset:
          ((tableParams.pagination.current || 0) - 1) *
          (tableParams.pagination.pageSize || 0),
      },
    ],
    fetcher,
    {
      dedupingInterval: 1000,
    }
  );
  const {
    data: types,
    mutate: mutateTypeHealth,
    isLoading: loadingType,
  } = useSWR(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });
  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    // setQueryParams((prev) => ({
    //   ...prev,
    //   [dataIndex]: selectedKeys[0],
    // }));
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<HealthFacilityColumns> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<BsSearch />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <BsSearch style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => {
      return searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      );
    },
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
        ...getColumnSearchProps("name"),
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        render: (text) => <a>{text}</a>,
        ...getColumnSearchProps("address"),
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
    [types, getColumnSearchProps]
  );

  const data = React.useMemo<Partial<HealthFacility>[]>(() => {
    if (!healthFacilities?.rows) return [];
    return healthFacilities?.rows.map((row, index) => ({
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
        options={{
          sticky: true,
          loading: isLoading,
          pagination: {
            total: healthFacilities?.count || 0,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          },
          showSorterTooltip: false,
          onChange: handleTableChange,
        }}
        columns={columns}
        data={data}
      />
    </div>
  );
}
