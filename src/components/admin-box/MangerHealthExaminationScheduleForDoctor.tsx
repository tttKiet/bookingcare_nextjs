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

import {
  HealthExaminationSchedule,
  ResAdminHealthExaminationSchedule,
  Staff,
  StaffAndSchedule,
  Working,
} from "@/models";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "@nextui-org/react";
import { EyeActionBox } from "../box/EyeActionBox.";
import BodyViewSchedule from "../body-modal/BodyViewSchedule";
const { confirm } = Modal;

type DataIndex = keyof HealthExaminationSchedule;
interface MangerHealthExaminationScheduleForDoctorProps {}

export function MangerHealthExaminationScheduleForDoctor({}: MangerHealthExaminationScheduleForDoctorProps) {
  // State components
  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);
  const [scheduleViewer, setScheduleViewer] =
    useState<ResAdminHealthExaminationSchedule | null>(null);
  const [workingIdDoctorLogined, setWorkingIdDoctorLogined] =
    useState<string>("");

  const { profile } = useAuth();

  const [showScheduleCreateOrUpdateModal, setShowScheduleCreateOrUpdateModal] =
    useState(false);
  const toggleShowScheduleCreateOrUpdateModal = () => {
    setShowScheduleCreateOrUpdateModal((s) => {
      return !s;
    });
  };
  const [dateSelect, setDateSelect] = useState<Dayjs | null>(null);
  const onChangeDate = (date: Dayjs | null) => {
    setDateSelect(date);
  };

  const toggleShowModalDetails = () => {
    setShowModalDetails((s) => {
      return !s;
    });
  };

  // Search health facilities state

  const { data: doctor } = useSWR<ResDataPaginations<Working>>(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorId=${
      profile?.id?.toString() || ""
    }`,
    {
      revalidateOnMount: false,
    }
  );
  console.log("doctordoctordoctordoctor", doctor);

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
  const handleClickView = (record: ResAdminHealthExaminationSchedule) => {
    setScheduleViewer(record);
    toggleShowModalDetails();
  };
  useEffect(() => {
    if (doctor?.rows?.[0]?.id) setWorkingIdDoctorLogined(doctor?.rows?.[0]?.id);
  }, [doctor?.rows?.[0]?.id, doctor]);
  // Table
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
  const fetcher: BareFetcher<
    ResDataPaginations<ResAdminHealthExaminationSchedule>
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
  } = useSWR<ResDataPaginations<ResAdminHealthExaminationSchedule>>(
    [
      API_DOCTOR_SCHEDULE_HEALTH_EXAM,
      {
        staffId: profile?.id,
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

  const handleTableChange: TableProps<ResAdminHealthExaminationSchedule>["onChange"] =
    (pagination, filters) => {
      setTableParams({
        pagination,
      });
    };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<ResAdminHealthExaminationSchedule | any> => ({
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

  const [obEditScheduleDoctor, setBbEditScheduleDoctor] = useState<{
    workingId: string;
    staffId: string;
    date: string | Object | Date | undefined | null;
  } | null>(null);

  function handleClickEditScheduleDoctor(
    workingId: string,
    date: string | Object | Date | undefined | null,
    staffId: string
  ) {
    setBbEditScheduleDoctor(() => ({
      date,
      workingId,
      staffId,
    }));
    toggleShowModalDetails();
    toggleShowScheduleCreateOrUpdateModal();
  }

  const data = useMemo<Partial<ResAdminHealthExaminationSchedule>[]>(() => {
    return responseSchedules?.rows.map(
      (schedule: ResAdminHealthExaminationSchedule) => ({
        ...schedule,
        key: schedule.date,
      })
    );
  }, [responseSchedules]);

  // Columns
  const columns: ColumnsType<ResAdminHealthExaminationSchedule> =
    useMemo(() => {
      return [
        {
          title: "Ngày",
          dataIndex: "date",
          key: "date",
          render: (text) => <a className="font-bold">{text}</a>,
          width: "16%",
        },
        {
          title: "Tổng số khung giờ khám",
          dataIndex: "data",
          key: "data",
          render: (text: StaffAndSchedule[]) => (
            <a>
              <Chip color="primary" variant="flat">
                +{text.reduce((init, t) => t.schedules.length + init, 0)} khung
                giờ
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
                <EyeActionBox
                  onClick={() => {
                    handleClickView(record);
                  }}
                />
              </ActionGroup>
            );
          },
        },
      ];
    }, [getColumnSearchProps]);

  return (
    <div className="">
      <ModalPositionHere
        width={620}
        show={showScheduleCreateOrUpdateModal}
        toggle={() => {
          toggleShowScheduleCreateOrUpdateModal();
        }}
        footer={false}
        body={
          <BodyModalSchedule
            auth="doctor"
            obEditScheduleDoctor={obEditScheduleDoctor}
            workingId={workingIdDoctorLogined}
            clickCancel={toggleShowScheduleCreateOrUpdateModal}
            handleSubmitForm={handleSubmitFormSchedule}
          />
        }
        title={"Chỉnh sửa lịch"}
      />

      <ModalPositionHere
        show={showModalDetails}
        toggle={() => {
          toggleShowModalDetails();
        }}
        config={{ zIndex: 40 }}
        width={800}
        footer={false}
        body={
          <BodyViewSchedule
            date={scheduleViewer?.date || null}
            viewData={scheduleViewer}
            handleClickEdit={handleClickEditScheduleDoctor}
          />
        }
        title={`Lịch khám bệnh ngày ${scheduleViewer?.date}`}
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        <div>Lịch khám bệnh - {profile?.fullName}</div>

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
