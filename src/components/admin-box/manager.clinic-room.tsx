"use client";

import { API_HEALTH_FACILITY_ROOM } from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { ClinicRoom } from "@/models";
import { ResDataPaginations } from "@/types";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import get from "lodash.get";
import isequal from "lodash.isequal";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { TableSortFilter } from "../table";
import { useMemo, useRef, useState } from "react";
const { confirm } = Modal;

type DataIndex = keyof ClinicRoom;

export function ManagerClinicRoom() {
  // Table
  const [queryParams, setQueryParams] = useState<Partial<ClinicRoom>>({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const [tableParams, setTableParams] = useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const fetcher: BareFetcher<ResDataPaginations<ClinicRoom>> = async ([
    url,
    token,
  ]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: responseClinicRooms,
    mutate: mutateClinicRooms,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<ClinicRoom>>(
    [
      API_HEALTH_FACILITY_ROOM,
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
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    setSearchedColumn(dataIndex);
    setSearchText(selectedKeys[0]);
    confirm();
  };

  const handleTableChange: TableProps<ClinicRoom>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
    }));
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<ClinicRoom> => ({
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
      get(record, dataIndex)
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => {
      return isequal(searchedColumn, dataIndex) ? (
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

  const data = useMemo<ClinicRoom[]>(() => {
    return responseClinicRooms?.rows.map((clinicRoom: ClinicRoom) => ({
      ...clinicRoom,
      key: "" + clinicRoom.healthFacilityId + clinicRoom.roomNumber,
    }));
  }, [responseClinicRooms]);

  const columns: ColumnsType<ClinicRoom> = useMemo(() => {
    return [
      {
        title: "Số phòng",
        dataIndex: "roomNumber",
        key: "roomNumber",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.roomNumber - b.roomNumber,
        ...getColumnSearchProps("roomNumber"),
        width: "18%",
      },
      {
        title: "Cơ sở y tế",
        dataIndex: ["HealthFacility", "name"],
        key: "HealthFacility.name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.HealthFacility.name.localeCompare(b.HealthFacility.name),
        ...getColumnSearchProps(["HealthFacility", "name"]),
      },
      {
        title: "Sức chứa",
        dataIndex: "capacity",
        key: "capacity",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.capacity - b.capacity,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{moment(text).locale("vi").calendar()}</a>,
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div className="">
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách phòng khám
      </h3>
      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseClinicRooms?.count,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "12", "24", "50"],
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
