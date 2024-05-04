"use client";

import { API_DOCTOR_SCHEDULE_ALL } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { adminApi, staffApi } from "@/api-services";
import {
  Code,
  HealthExaminationSchedule,
  HealthExaminationScheduleResAll,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { Chip, useDisclosure } from "@nextui-org/react";
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
import { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { ActionBox, ActionGroup } from "../box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import ListDotDotDotTimeCode from "./ListDotDotDotTimeCode";
import { BodyAddEditSchedule } from "../body-modal/BodyAddEditSchedule";
import { BodyModalSchedule, ReqSchedule } from "../body-modal";
import { DatePicker } from "@nextui-org/date-picker";
import { DateValue } from "@nextui-org/calendar";
import { now, getLocalTimeZone, parseDate } from "@internationalized/date";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { HiX } from "react-icons/hi";
const { confirm } = Modal;

type DataIndex = keyof HealthExaminationScheduleResAll;

export function ManagerScheduleAdmin() {
  // state
  let [date, setDate] = useState<DateValue | undefined>();
  const {
    isOpen: isOpentAdd,
    onClose: onCloseAdd,
    onOpen: onOpenAdd,
  } = useDisclosure();

  const {
    isOpen: isOpentEdit,
    onClose: onCloseEdit,
    onOpen: onOpenEdit,
  } = useDisclosure();

  const [obEdit, setObEdit] = useState<
    HealthExaminationScheduleResAll | undefined
  >();
  // Table
  const [queryParams, setQueryParams] = useState<
    Partial<HealthExaminationScheduleResAll>
  >({});
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

  const fetcher: BareFetcher<ResDataPaginations<any>> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;

  const {
    mutate: mutateSchedule,
    data: responseSchedule,
    error,
    isLoading: isLoadingFetching,
  } = useSWR<ResDataPaginations<HealthExaminationScheduleResAll>>(
    [
      API_DOCTOR_SCHEDULE_ALL,
      {
        ...queryParams,
        date:
          moment(new Date(date?.toString() || "")).format("MM[/]DD[/]YYYY") ||
          "",
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

  function handleClickEditCedicine(e: HealthExaminationScheduleResAll): void {
    setObEdit(e);
    onOpenEdit();
  }

  async function handleSubmitForm(data: any): Promise<boolean> {
    const api = adminApi.createSchedule(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateSchedule();
    }
    return isOk;
  }

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

  const handleTableChange: TableProps<HealthExaminationScheduleResAll>["onChange"] =
    (pagination, filters) => {
      setTableParams({
        pagination,
      });
      setQueryParams((prev) => ({
        ...prev,
        ...filters,
      }));
    };
  function handleClickDeleteCedicine(
    record: HealthExaminationScheduleResAll
  ): void {
    confirm({
      title: `Bạn có muốn xóa lịch ngày: "${record?.date}" của bác sĩ "${record?.working?.Staff?.fullName}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về lịch này và không thể khôi phục`,
      async onOk() {
        // const api = adminApi.deleteSchedule({
        //   workingId: record?.working?.id || "",
        //   schedule: record?.schedule || [],
        //   date: record?.date.toString() || "",
        // });
        const api = adminApi.deleteSchedule({
          schedule: record?.schedule || [],
        });
        const isOk = await toastMsgFromPromise(api);
        mutateSchedule();
        return isOk;
      },
      onCancel() {},
    });
  }

  // edit
  async function handleSubmitFormScheduleEdit(
    data: Partial<ReqSchedule>
  ): Promise<boolean> {
    const api = staffApi.createOrUpdateSchedule({
      ...data,
      timeCode: data.timeCodeArray,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateSchedule();
    }
    return isOk;
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<HealthExaminationScheduleResAll> => ({
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
  const data = useMemo<HealthExaminationScheduleResAll[]>(() => {
    return responseSchedule?.rows.map(
      (data: HealthExaminationScheduleResAll) => ({
        ...data,
        key: data?.working?.createdAt + data?.date,
      })
    );
  }, [responseSchedule]);

  const columns: ColumnsType<HealthExaminationScheduleResAll> = useMemo(() => {
    return [
      {
        title: "Bác sĩ",
        dataIndex: ["working", "Staff", "fullName"],
        key: "staffName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.working.Staff.fullName.localeCompare(b.working.Staff.fullName),
        ...getColumnSearchProps(["working", "Staff", "fullName"]),
      },
      {
        title: "Cơ sở y tế",
        dataIndex: ["working", "HealthFacility", "name"],
        key: "healthFacilityName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.working.HealthFacility.name.localeCompare(
            b.working.HealthFacility.name
          ),
        ...getColumnSearchProps(["working", "HealthFacility", "name"]),
      },
      {
        title: "Ngày khám",
        dataIndex: "date",
        key: "date",
        render: (text) => <a>{moment(text).format("DD MMMM YYYY")} </a>,
        // sorter: (a, b) => (moment(a.date).isAfter(moment(b.date)) ? 1 : -1),
      },
      {
        title: "Số khung giờ",
        dataIndex: "schedule",
        key: "schedule",
        render: (h: HealthExaminationSchedule[]) => (
          <a>
            <ListDotDotDotTimeCode timeCodeArray={h} />
          </a>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="edit"
                onClick={() => handleClickEditCedicine(record)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteCedicine(record)}
              />
            </ActionGroup>
          );
        },
        width: "150px",
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div className="">
      <ModalPositionHere
        width={620}
        show={isOpentEdit}
        toggle={onCloseEdit}
        footer={false}
        body={
          <BodyModalSchedule
            obEdit={obEdit}
            clickCancel={onCloseEdit}
            handleSubmitForm={handleSubmitFormScheduleEdit}
          />
        }
        title={"Chỉnh sửa lịch"}
      />
      <ModalPositionHere
        show={isOpentAdd}
        toggle={onCloseAdd}
        size="2xl"
        footer={false}
        body={
          <BodyAddEditSchedule
            clickCancel={onCloseAdd}
            handleSubmitForm={handleSubmitForm}
          />
        }
        title={!obEdit ? "Thêm lịch hẹn" : "Sửa lịch hẹn"}
      />
      <h3 className="gr-title-admin flex items-start justify-between  mb-4">
        Danh sách lịch hẹn
        <div className="flex items-center gap-3 flex-shrink-0">
          <DatePicker
            labelPlacement="outside-left"
            label="Tìm kiếm ngày khám"
            size="md"
            value={date || null}
            startContent={
              date && (
                <span
                  className="p-2 cursor-pointer hover:opacity-90"
                  onClick={() => setDate(undefined)}
                >
                  <HiX size={18} />
                </span>
              )
            }
            variant="bordered"
            onChange={(e) => {
              setTableParams((v) => {
                return {
                  pagination: {
                    current: 1,
                    pageSize: 6,
                  },
                };
              });
              setDate(e);
            }}
            classNames={{ label: "text-left" }}
          />
          <BtnPlus
            title="Tạo lịch hẹn"
            onClick={() => {
              onOpenAdd();
            }}
          />
        </div>
      </h3>

      <TableSortFilter
        options={{
          loading: isLoadingFetching,
          pagination: {
            total: responseSchedule?.count,
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
