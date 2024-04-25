"use client";

import { API_CODE, API_DOCTOR_BOOKING } from "@/api-services/constant-api";
import { Booking, Code, ResBookingAndHealthRecord } from "@/models";
import { ResDataPaginations } from "@/types";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Button,
  Chip,
  Modal as ModalNext,
  Input as InputNext,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Input, InputRef, Modal, Space } from "antd";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import get from "lodash.get";
import isEqual from "lodash.isequal";
import moment from "moment";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import { ActionGroup } from "../box";
import { EyeActionBox } from "../box/EyeActionBox.";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { getColorChipCheckUp, getColorChipHR } from "@/untils/common";
import { useAuth } from "@/hooks";
const { confirm } = Modal;

type DataIndex = keyof Booking;

export function AppointmentSchedule() {
  const { profile } = useAuth();
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

  const [valueTimeCode, setValueTimeCode] = useState<string | undefined>();
  const [valueCheckUp, setValueCheckUp] = useState<string | undefined>();
  const [date, setDate] = useState<string>(
    moment(new Date()).format("YYYY[-]MM[-]DD")
  );

  const searchInput = useRef<InputRef>(null);
  const [tableParams, setTableParams] = useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const fetcher: BareFetcher<
    ResDataPaginations<ResBookingAndHealthRecord>
  > = async ([url, token]) =>
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
  } = useSWR<ResDataPaginations<ResBookingAndHealthRecord>>(
    [
      API_DOCTOR_BOOKING,
      {
        limit: tableParams.pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset:
          ((tableParams.pagination.current || 0) - 1) *
          (tableParams.pagination.pageSize || 0),
        ...queryParams,
        timeCodeId: valueTimeCode,
        checkUpCodeId: valueCheckUp,
        date: date,
        staffId: profile?.id,
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

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<ResBookingAndHealthRecord> => ({
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
            color="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            startContent={<BsSearch />}
            size="sm"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="sm"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            color="secondary"
            size="sm"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            color="secondary"
            size="sm"
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
  // console.log(response);
  const data = useMemo<Booking[]>(() => {
    return response?.rows?.map((d: Booking) => ({
      ...d,
      key: d?.id,
    }));
  }, [response]);

  // Columns
  const columns: ColumnsType<ResBookingAndHealthRecord> = useMemo(() => {
    return [
      {
        title: "Tên bệnh nhân",
        dataIndex: ["booking", "PatientProfile", "fullName"],
        key: "PatientProfile.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.booking.PatientProfile.fullName.localeCompare(
            b.booking.PatientProfile.fullName
          ),
        ...getColumnSearchProps(["PatientProfile", "fullName"]),
      },
      {
        title: "Ngày khám",
        dataIndex: ["booking", "HealthExaminationSchedule", "date"],
        key: "HealthExaminationSchedule.date",
        render: (text) => <a>{text && moment(text).format("LLLL")}</a>,
      },
      {
        title: "Số điện thoại",
        dataIndex: ["booking", "PatientProfile", "phone"],
        key: "PatientProfile.phone",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Trạng thái lịch hẹn",
        dataIndex: ["booking", "Code"],
        key: "Code",
        render: (code: Code) => {
          const color = getColorChipCheckUp(code?.key);
          return (
            <a>
              <Chip
                className="capitalize"
                color={color}
                size="sm"
                variant="flat"
              >
                {code?.value}
              </Chip>
            </a>
          );
        },
      },
      {
        title: "Trạng thái phiếu khám",
        dataIndex: ["healthRecord", "status"],
        key: "status",
        render: (code: Code) => {
          if (!code) {
            return (
              <a>
                <Chip
                  className="capitalize"
                  color={"default"}
                  size="sm"
                  variant="flat"
                >
                  Chưa tạo
                </Chip>
              </a>
            );
          }
          const color = getColorChipHR(code?.key);
          return (
            <a>
              <Chip
                className="capitalize"
                color={color}
                size="sm"
                variant="flat"
              >
                {code?.value}
              </Chip>
            </a>
          );
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <EyeActionBox
                href={`/doctor/check-health/${record.booking.id}`}
                onClick={() => {}}
              />
            </ActionGroup>
          );
        },
      },
    ];
  }, [getColumnSearchProps]);

  const { data: resCode } = useSWR<ResDataPaginations<Code>>(API_CODE);

  const optionTime = useMemo<Code[]>(
    () => resCode?.rows.filter((c: Code) => c.name == "Time") || [],
    [resCode]
  );

  const optionCheckUp = useMemo<Code[]>(
    () => resCode?.rows.filter((c: Code) => c.name == "CheckUp") || [],
    [resCode]
  );

  function handleChangeSelectTime(event: ChangeEvent<HTMLSelectElement>) {
    setValueTimeCode(event.target.value);
  }

  function handleChangeSelectCheckUp(event: ChangeEvent<HTMLSelectElement>) {
    setValueCheckUp(event.target.value);
  }

  return (
    <div className="mt-2">
      <ModalPositionHere
        show={showModalDetails}
        toggle={() => {
          toggleShowModalDetails();
        }}
        // config={{ zIndex: 40 }}
        width={800}
        footer={false}
        body={<div></div>}
        title="Thông tin các dịch vụ của cơ sở y tế"
      />

      <div className="flex items-center justify-between gap-3 mb-5">
        <h4 className="gr-title-admin  inline-flex items-center justify-between">
          Lịch hẹn khám bệnh
        </h4>
        <div className="flex items-center gap-4 justify-around flex-shrink-0">
          <InputNext
            type="date"
            className="w-44"
            label="Ngày khám"
            placeholder="Ngày khám..."
            value={date}
            onClear={() => setDate("")}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            isClearable={true}
          />
          <Select
            value={valueTimeCode}
            onChange={handleChangeSelectTime}
            label="Khung giờ"
            className="w-44"
            placeholder="Xem ở khung giờ..."
          >
            {optionTime.map((code: Code) => (
              <SelectItem key={code.key} value={code.value}>
                {code.value}
              </SelectItem>
            ))}
          </Select>
          <Select
            value={valueCheckUp}
            onChange={handleChangeSelectCheckUp}
            label="Trạng thái"
            className="w-44"
            placeholder="Xem trạng thái"
          >
            {optionCheckUp.map((code: Code) => (
              <SelectItem key={code?.key} value={code.value}>
                {code.value}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

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
