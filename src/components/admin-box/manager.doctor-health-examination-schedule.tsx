"use client";

import { staffApi } from "@/api-services";
import {
  API_ACCOUNT_STAFF_DOCTOR,
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_DOCTOR_SCHEDULE_HEALTH_EXAM,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  InputRef,
  Modal,
  SelectProps,
  Space,
} from "antd";
import axios from "../../axios";

import { HealthExaminationSchedule, Staff, Working } from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import { Dayjs } from "dayjs";
import moment from "moment";
import * as React from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import useSWR, { BareFetcher } from "swr";
import { BodyModalSchedule, ReqSchedule } from "../body-modal";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { SelectSearchField } from "../form";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { useAuth, userRandomBgLinearGradient } from "@/hooks";
const { confirm } = Modal;

type DataIndex = keyof HealthExaminationSchedule;
interface ManagerHealthExamScheduleProps {
  permission?: "doctor" | "admin";
}

export function ManagerHealthExamSchedule({
  permission = "admin",
}: ManagerHealthExamScheduleProps) {
  // State components
  const { profile } = useAuth();
  const isDoctor = permission === "doctor";
  const [bgRandom] = userRandomBgLinearGradient();
  function handleClickDeleteSchedule(record: HealthExaminationSchedule): void {
    confirm({
      title: `Bạn có muốn xóa lịch khám "${
        record.TimeCode.value
      }" của ngày ${moment(record.date).format("L")}?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.TimeCode.value}" và không thể khôi phục`,
      async onOk() {
        const api = staffApi.deleteScheduleDoctor(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateSchedules();
        return isOk;
      },
      onCancel() {},
    });
  }

  const [showScheduleCreateOrUpdateModal, setShowScheduleCreateOrUpdateModal] =
    React.useState(false);
  const toggleShowScheduleCreateOrUpdateModal = () => {
    setShowScheduleCreateOrUpdateModal((s) => {
      return !s;
    });
  };
  const [dateSelect, setDateSelect] = React.useState<Dayjs | null>(null);
  const onChangeDate = (date: Dayjs | null) => {
    setDateSelect(date);
  };

  // Search health facilities state
  const [selectValue, setSelectValue] = React.useState<string | null>(null);
  const [doctorIdSelect, setDoctorIdSelect] = React.useState<string | null>(
    null
  );

  function handleSearchSelect(value: string): void {
    setSelectValue(value);
  }

  function handleChangeSelect(value: string): void {
    setDoctorIdSelect(value);
  }
  const { data: doctors } = useSWR(
    `${API_ACCOUNT_STAFF_DOCTOR}?email=${selectValue}`,
    {
      revalidateOnMount: false,
    }
  );

  const [dataSearch, setDataSearch] = React.useState<SelectProps["options"]>();

  React.useEffect(() => {
    const data = doctors?.rows.map((doctor: Staff) => ({
      value: doctor.id,
      text: (
        <div className="flex items-center gap-2">
          <RxAvatar size={26} color="gray" />
          <div className="flex-1">
            <h4 className="text-sm p-y-[1px]  text-black">{doctor.fullName}</h4>
            <div className="flex items-center justify-between gap-x-4">
              <span className="text-xs font-normal text-blue-600">
                {doctor.email}
              </span>
              <span className="text-xs font-normal text-right text-gray-500 max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden">
                {doctor.AcademicDegree.name}
              </span>
            </div>
          </div>
        </div>
      ),
    }));
    setDataSearch(data);
  }, [doctors]);

  async function handleSubmitFormSchedule(
    data: Partial<ReqSchedule>
  ): Promise<boolean> {
    const api = staffApi.createOrUpdateSchedule({
      ...data,
      timeCode: data.timeCodeArray,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateSchedules();
    }
    return isOk;
  }

  // Table
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);
  const [tableParams, setTableParams] = React.useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const fetcher: BareFetcher<
    ResDataPaginations<HealthExaminationSchedule>
  > = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: responseSchedules,
    mutate: mutateSchedules,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<HealthExaminationSchedule>>(
    [
      API_DOCTOR_SCHEDULE_HEALTH_EXAM,
      {
        staffId: doctorIdSelect,
        date: dateSelect,
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

  const handleTableChange: TableProps<HealthExaminationSchedule>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<HealthExaminationSchedule> => ({
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
  const { data: doctor } = useSWR<ResDataPaginations<Working>>(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorId=${(
      isDoctor && profile?.id
    )?.toString()}`,
    {
      revalidateOnMount: true,
    }
  );

  const data = React.useMemo<Partial<HealthExaminationSchedule>[]>(() => {
    return responseSchedules?.rows.map(
      (schedule: HealthExaminationSchedule) => ({
        ...schedule,
        key: schedule.id,
      })
    );
  }, [responseSchedules]);

  // Columns
  const columns: ColumnsType<HealthExaminationSchedule> = React.useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => <a>{text}</a>,
        width: "16%",
      },
      {
        title: "Ngày khám",
        dataIndex: "date",
        key: "date",
        render: (text) => <a>{moment(text).format("L")}</a>,
        sorter: (a, b) => {
          if (typeof a.date === "string" && typeof b.date === "string") {
            return a.date.localeCompare(b.date);
          } else return 0;
        },
      },

      {
        title: "Bác sỉ",
        dataIndex: ["Working", "Staff", "fullName"],
        key: "Working.Staff.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.Working.Staff.fullName.localeCompare(b.Working.Staff.fullName),
      },
      {
        title: "Thời gian",
        dataIndex: ["TimeCode", "value"],
        key: "TimeCode.value",
        render: (text) => (
          <span className="px-4 py-1 bg-green-500 rounded-2xl text-white ">
            {text}
          </span>
        ),
        sorter: (a, b) => a.TimeCode.value.localeCompare(b.TimeCode.value),
      },
      {
        title: "Tối đa bệnh nhân khám",
        dataIndex: "maxNumber",
        key: "maxNumber",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.maxNumber - b.maxNumber,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteSchedule(record)}
              />
            </ActionGroup>
          );
        },
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div className="p-4 px-6">
      <ModalPositionHere
        width={620}
        show={showScheduleCreateOrUpdateModal}
        toggle={() => {
          toggleShowScheduleCreateOrUpdateModal();
        }}
        footer={false}
        body={
          <BodyModalSchedule
            maxNumberExists={(isDoctor && doctor?.rows?.[0]?.maxNumber) || 3}
            workingId={(isDoctor && doctor?.rows?.[0]?.id) || false}
            clickCancel={toggleShowScheduleCreateOrUpdateModal}
            handleSubmitForm={handleSubmitFormSchedule}
          />
        }
        title={"Thêm mới"}
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        {!isDoctor ? (
          <>
            Lịch khám bệnh
            <div className="flex-shrink-0">
              <SelectSearchField
                placeholder="Tìm kiếm: nhập email bác sỉ ..."
                data={dataSearch}
                handleSearchSelect={handleSearchSelect}
                handleChangeSelect={handleChangeSelect}
                value={doctorIdSelect}
                debounceSeconds={300}
              />
            </div>
          </>
        ) : (
          <div>Lịch khám bệnh - {profile?.fullName}</div>
        )}
        <div className="flex items-center justify-end gap-3">
          <DatePicker
            bordered={true}
            value={dateSelect}
            onChange={onChangeDate}
            placement="bottomLeft"
          />

          <BtnPlus
            onClick={() => {
              toggleShowScheduleCreateOrUpdateModal();
            }}
          />
        </div>
      </h3>
      <TableSortFilter
        options={{
          sticky: true,
          loading: isLoading,
          pagination: {
            total: responseSchedules?.count,
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
