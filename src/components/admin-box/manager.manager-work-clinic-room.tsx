"use client";

import {
  API_HEALTH_FACILITIES,
  API_HEALTH_FACILITY_ROOM,
  API_WORK_ROOM,
} from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, SelectProps, Space } from "antd";
import axios from "../../axios";

import { ClinicRoom, HealthFacility, WorkRoom } from "@/models";
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
import Image from "next/image";
import * as React from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { BodyModalClinicRoomWork } from "../body-modal/body.add-edit-work-clinic-room";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { SelectSearchField } from "../form";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { doctorApi, staffApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
const { confirm } = Modal;

type DataIndex = keyof WorkRoom;

export function ManagerClinicWork() {
  // State components
  const [obEdit, setObEdit] = React.useState<WorkRoom | null>();

  const [showCreateOrUpdateModal, setShowCreateOrUpdateModal] =
    React.useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowCreateOrUpdateModal = () => {
    setShowCreateOrUpdateModal((s) => {
      return !s;
    });
  };

  function editWorkRoom(record: WorkRoom): void {
    setObEdit(record);
    toggleShowCreateOrUpdateModal();
  }

  function handleDeleteWorkRoom(record: WorkRoom): void {
    confirm({
      title: `Bạn có muốn xóa thành viên "${record.Working.Staff.fullName}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.id}" và không thể khôi phục`,
      async onOk() {
        const api = doctorApi.deleteWorkRoom(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateWorkRooms();
        return isOk;
      },
      onCancel() {},
    });
  }

  // Table
  const [queryParams, setQueryParams] = React.useState<Partial<WorkRoom>>({});
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
  // Search health facilities state
  const [selectHealthValue, setSelectHealthValue] = React.useState<
    string | null
  >(null);
  const [searchHealthSelect, setSearchHealthSelect] = React.useState<
    string | null
  >("");

  function handleSearchSelect(value: string): void {
    setSearchHealthSelect(value);
  }

  function handleChangeSelect(value: string): void {
    setSelectHealthValue(value);
  }
  const fetcher: BareFetcher<ResDataPaginations<any>> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  // Room
  const { data: responseClinics, mutate: mutateClinics } = useSWR<
    ResDataPaginations<ClinicRoom>
  >(
    [
      API_HEALTH_FACILITY_ROOM,
      {
        healthFacilityId: selectHealthValue,
      },
    ],
    fetcher,
    {
      revalidateOnMount: false,
      dedupingInterval: 5000,
    }
  );
  // Clinic
  const [selectClinicRoomNumber, setselectClinicRoomNumber] = React.useState<
    number | null
  >(responseClinics?.rows?.[0]?.roomNumber || null);

  React.useEffect(() => {
    setselectClinicRoomNumber(responseClinics?.rows?.[0]?.roomNumber || null);
  }, [responseClinics]);

  function handleSearchSelectClinic(value: string): void {}

  function handleChangeSelectClinic(value: string): void {
    setselectClinicRoomNumber(Number.parseInt(value));
  }

  const {
    data: responseWorkRooms,
    mutate: mutateWorkRooms,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<WorkRoom>>(
    [
      API_WORK_ROOM,
      {
        ...queryParams,
        healthFacilityId: selectHealthValue,
        roomNumber: selectClinicRoomNumber,
        limit: tableParams.pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset:
          ((tableParams.pagination.current || 0) - 1) *
          (tableParams.pagination.pageSize || 0),
      },
    ],
    fetcher,
    {
      revalidateOnMount: false,
      dedupingInterval: 5000,
    }
  );

  // Submit form
  async function handleSubmitForm(data: Partial<WorkRoom>): Promise<boolean> {
    const api = doctorApi.createOrUpdateWorkRoom({
      ...data,
      ClinicRoomHealthFacilityId: selectHealthValue || "",
      ClinicRoomRoomNumber: selectClinicRoomNumber || undefined,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateWorkRooms();
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
  ): ColumnType<WorkRoom> => ({
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

  const data = React.useMemo<WorkRoom[]>(() => {
    return responseWorkRooms?.rows.map((workRoom: WorkRoom) => ({
      ...workRoom,
      key: workRoom.id,
    }));
  }, [responseWorkRooms]);

  const columns: ColumnsType<WorkRoom> = React.useMemo(() => {
    return [
      {
        title: "Bác sỉ",
        dataIndex: ["Working", "Staff", "fullName"],
        key: "Working.Staff.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.Working.Staff.fullName.localeCompare(b.Working.Staff.fullName),
      },
      {
        title: "Giá khám",
        dataIndex: "checkUpPrice",
        key: "checkUpPrice",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.checkUpPrice - b.checkUpPrice,
      },
      {
        title: "Ngày áp dụng",
        dataIndex: "applyDate",
        key: "applyDate",
        render: (text) => <a>{text && moment(text).format("L")}</a>,
        sorter: (a, b) =>
          a.applyDate.toString().localeCompare(b.applyDate.toString()),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => editWorkRoom(record)} />
              <ActionBox
                type="delete"
                onClick={() => handleDeleteWorkRoom(record)}
              />
            </ActionGroup>
          );
        },
        width: "150px",
      },
    ];
  }, [getColumnSearchProps]);

  // Search health
  const { data: responseHealthFacilities, mutate: mutateHealthFacilities } =
    useSWR<ResDataPaginations<HealthFacility>>(
      [
        API_HEALTH_FACILITIES,
        {
          searchNameOrEmail: searchHealthSelect,
        },
      ],
      fetcher,
      {
        revalidateOnMount: true,
        dedupingInterval: 5000,
      }
    );

  const dataSearchClinic: SelectProps["options"] = responseClinics?.rows.map(
    (clinic: ClinicRoom) => ({
      value: clinic.roomNumber,
      text: <h3 className="text-cyan-600">{clinic.roomNumber}</h3>,
    })
  );

  const dataSearch: SelectProps["options"] = responseHealthFacilities?.rows.map(
    (healh: HealthFacility) => ({
      value: healh.id,
      text: (
        <div className="flex align-top gap-2">
          <Image
            className="rounded-full border border-white object-cover w-[32px] h-[32px]"
            alt="Health Facility"
            width={28}
            height={28}
            src={healh?.images?.[0] || ""}
          />
          <div className="flex-1">
            <h4 className="text-sm p-y-[1px]  text-black">{healh.name}</h4>
            <div className="flex items-center justify-between gap-x-4">
              <span className="text-xs font-normal text-blue-600">
                {healh.email}
              </span>
              <span className="text-xs font-normal text-right text-gray-500 max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden">
                {healh.address}
              </span>
            </div>
          </div>
        </div>
      ),
    })
  );

  return (
    <div className="">
      <ModalPositionHere
        show={showCreateOrUpdateModal}
        toggle={() => {
          toggleShowCreateOrUpdateModal();
        }}
        width={800}
        footer={false}
        body={
          <BodyModalClinicRoomWork
            clickCancel={toggleShowCreateOrUpdateModal}
            handleSubmitForm={handleSubmitForm}
            obEdit={obEdit}
            healthFacilityId={selectHealthValue}
          />
        }
        title={
          obEdit?.ClinicRoomRoomNumber
            ? `Sửa phân công phòng * ${obEdit.ClinicRoomRoomNumber} *`
            : "Phân công phòng"
        }
      />
      <div className="flex items-center gap-3">
        <div>
          <h3 className="mb-2">Tìm kiếm cơ sở y tế</h3>
          <div className="flex items-end gap-2 ">
            <SelectSearchField
              placeholder="Nhập tên hoặc email cơ sơ y tế"
              data={dataSearch}
              handleSearchSelect={handleSearchSelect}
              handleChangeSelect={handleChangeSelect}
              value={selectHealthValue}
            />
          </div>
        </div>
        {selectHealthValue && selectClinicRoomNumber && (
          <div>
            <h3 className="mb-2">Phòng khám</h3>
            <div className="flex items-end gap-2 ">
              <SelectSearchField
                allowClear={false}
                placeholder="Phòng khám"
                data={dataSearchClinic}
                handleSearchSelect={handleSearchSelectClinic}
                handleChangeSelect={handleChangeSelectClinic}
                value={selectClinicRoomNumber?.toString()}
              />
            </div>
          </div>
        )}
      </div>

      {!(selectHealthValue && selectClinicRoomNumber) && (
        <h4 className="p-5 text-center">
          {selectHealthValue && !selectClinicRoomNumber && (
            <span>Cơ sở này chưa thêm dữ liệu phòng</span>
          )}
        </h4>
      )}

      {selectHealthValue && selectClinicRoomNumber && (
        <h3 className="gr-title-admin flex items-center justify-between mt-3  mb-3">
          Thành viên trong phòng
          <BtnPlus
            title="Thêm thành viên"
            onClick={() => {
              toggleShowCreateOrUpdateModal();
              setObEdit(null);
            }}
          />
        </h3>
      )}
      {data?.length > 0 && selectHealthValue && selectClinicRoomNumber && (
        <>
          <TableSortFilter
            options={{
              sticky: true,
              loading: isLoading,
              pagination: {
                total: responseWorkRooms?.count,
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
        </>
      )}
      {data?.length === 0 && selectHealthValue && selectClinicRoomNumber && (
        <div className="text-gray-500 text-center p-3 mt-4">
          Tất cả chổ khám trong phòng đều trống!
        </div>
      )}
    </div>
  );
}
