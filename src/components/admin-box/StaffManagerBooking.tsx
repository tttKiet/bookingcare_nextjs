"use client";

import { API_CODE, API_DOCTOR_BOOKING } from "@/api-services/constant-api";
import {
  Booking,
  Code,
  PatientProfile,
  ResBookingAndHealthRecord,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Chip,
  Modal as ModalNext,
  Input as InputNext,
  Select,
  SelectItem,
  useDisclosure,
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
import { CheckIcon } from "../icons/CheckIcon";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { staffApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import BodyPatientProfile from "../check-up/BodyPatientProfile";
import { Button } from "@nextui-org/button";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
const { confirm } = Modal;

type DataIndex = keyof Booking;

export function StaffManagerBooking() {
  // State components
  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);
  const [viewPatientProfile, setViewPatientProfile] = useState<
    PatientProfile | undefined
  >(undefined);

  // Toggle show modal create or update
  const toggleShowModalDetails = () => {
    setShowModalDetails((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };
  const {
    isOpen: isOpenProfile,
    onOpen: onOpenProfile,
    onClose: onCloseProfile,
  } = useDisclosure({ id: "profile" });

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
        width: 200,
      },
      {
        title: "Ngày khám",
        dataIndex: ["booking", "HealthExaminationSchedule", "date"],
        key: "HealthExaminationSchedule.date",
        render: (text) => <a>{text && moment(text).format("L")}</a>,
        width: 140,
      },
      {
        title: "Số điện thoại",
        dataIndex: ["booking", "PatientProfile", "phone"],
        key: "PatientProfile.phone",
        width: 140,
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
                radius="sm"
                variant="flat"
              >
                {code?.value}
              </Chip>
            </a>
          );
        },
        width: 150,
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
          let StartContent;
          if (color == "success") {
            StartContent = (
              <span className="mx-1">
                <IoCheckmarkDoneOutline size={18} />
              </span>
            );
          }
          return (
            <a>
              <Chip
                startContent={StartContent}
                className="capitalize"
                color={color}
                radius="sm"
                size="sm"
                variant="flat"
              >
                {code?.value}
              </Chip>
            </a>
          );
        },
        width: 250,
      },
      {
        title: "Hồ sơ khám",
        dataIndex: ["booking", "PatientProfile"],
        key: "booking.PatientProfile",
        render: (profile: PatientProfile) => {
          return (
            <a>
              <Button
                size="sm"
                color="default"
                variant="bordered"
                onPress={() => {
                  setViewPatientProfile(profile);
                  onOpenProfile();
                }}
              >
                Xem hồ sơ
              </Button>
            </a>
          );
        },

        width: 250,
      },
      {
        fixed: "right",
        title: "Hành động",
        key: "action",
        width: 250,

        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              {/* <EyeActionBox
                href={`/doctor/check-health/${record.booking.id}`}
                onClick={() => {}}
              /> */}

              {record.booking.Code.key !== "CU2" && (
                <Button
                  startContent={<CheckIcon />}
                  color="success"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    handleEditCode(record?.booking?.id || "", "CU2");
                  }}
                >
                  đã thanh toán
                </Button>
              )}

              {record.booking.Code.key !== "CU1" && (
                <Button
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  }
                  color="warning"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    handleEditCode(record?.booking?.id || "", "CU1");
                  }}
                >
                  chờ thanh toán
                </Button>
              )}
              {record.booking.Code.key !== "CU4" && (
                <Button
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      // className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  }
                  color="danger"
                  variant="flat"
                  size="sm"
                  onPress={() => {
                    handleEditCode(record?.booking?.id || "", "CU4");
                  }}
                >
                  hủy
                </Button>
              )}
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

  async function handleEditCode(bookingId: string, value: string) {
    const api = staffApi.editCodeBooking({
      status: value,
      id: bookingId,
    });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      mutate();
    }
  }

  return (
    <div className="mt-2">
      <ModalPositionHere
        show={isOpenProfile}
        toggle={onCloseProfile}
        // config={{ zIndex: 40 }}
        size="4xl"
        footer={false}
        body={
          <BodyPatientProfile
            patientProfile={viewPatientProfile}
            onClose={onCloseProfile}
          />
        }
        title="Thông tin hồ sơ người khám"
      />

      <div className="flex items-start justify-between gap-3 mb-5">
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
