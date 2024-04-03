"use client";

import {
  API_ADMIN_HOSPITAL_SERVICE,
  API_ADMIN_MANAGER_ADMIN_HEALTH,
  API_DOCTOR_BOOKING,
} from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import {
  AcademicDegree,
  Booking,
  HospitalService,
  ResAdminManagerHospitalService,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { Chip } from "@nextui-org/react";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import get from "lodash.get";
import isEqual from "lodash.isequal";
import { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { BodyManagerAdminHealth } from "../body-modal/BodyManagerAdminHealth";
import { ActionGroup } from "../box";
import { EyeActionBox } from "../box/EyeActionBox.";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { BodyAdminHospitalService } from "../body-modal/BodyAdminHospitalService";
import moment from "moment";
const { confirm } = Modal;

type DataIndex = keyof Booking;

export function AppointmentSchedule() {
  // State components
  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowModalDetails = () => {
    setShowModalDetails((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [queryParams, setQueryParams] = useState<{}>({
    healthFacilityEmail: "",
    healthFacilityName: "",
  });
  const searchInput = useRef<InputRef>(null);
  const [tableParams, setTableParams] = useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const fetcher: BareFetcher<ResDataPaginations<Booking>> = async ([
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
    data: response,
    mutate: mutate,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Booking>>(
    [
      API_DOCTOR_BOOKING,
      {
        limit: tableParams.pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset:
          ((tableParams.pagination.current || 0) - 1) *
          (tableParams.pagination.pageSize || 0),
        ...queryParams,
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

  const handleTableChange: TableProps<Booking>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });

    setQueryParams((prev) => {
      return {
        healthFacilityEmail: filters["healthFacility.email"],
        healthFacilityName: filters["healthFacility.name"],
      };
    });
  };

  const handleClickView = (record: Booking) => {
    toggleShowModalDetails();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Booking> => ({
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
      return isEqual(searchedColumn, dataIndex) ? (
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
  console.log(response);
  const data = useMemo<Booking[]>(() => {
    return response?.rows?.map((d: Booking) => ({
      ...d,
      key: d.id,
    }));
  }, [response]);

  // Columns
  const columns: ColumnsType<Booking> = useMemo(() => {
    return [
      {
        title: "Tên bệnh nhân",
        dataIndex: ["PatientProfile", "fullName"],
        key: "PatientProfile.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.PatientProfile.fullName.localeCompare(b.PatientProfile.fullName),
        ...getColumnSearchProps(["PatientProfile", "fullName"]),
      },
      {
        title: "Ngày đặt lịch",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{moment(text).format("LLLL")}</a>,
        // sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        // ...getColumnSearchProps("createdAt"),
      },
      {
        title: "Trạng thái",
        dataIndex: ["Code", "value"],
        key: "Code.value",
        render: (text: number) => (
          <a>
            <Chip
              className="capitalize"
              color={"primary"}
              size="sm"
              variant="flat"
            >
              {text}
            </Chip>
          </a>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <EyeActionBox onClick={() => {}} />
            </ActionGroup>
          );
        },
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div className="mt-2">
      <ModalPositionHere
        show={showModalDetails}
        toggle={() => {
          toggleShowModalDetails();
        }}
        config={{ zIndex: 40 }}
        width={800}
        footer={false}
        body={<div></div>}
        title="Thông tin các dịch vụ của cơ sở y tế"
      />

      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: response?.count,
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
