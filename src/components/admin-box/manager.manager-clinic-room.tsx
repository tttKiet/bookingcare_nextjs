"use client";

import { ReqClinicRoom, healthFacilitiesApi, userApi } from "@/api-services";
import {
  API_ACCOUNT_USER,
  API_HEALTH_FACILITIES,
  API_HEALTH_FACILITY_ROOM,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, SelectProps, Space } from "antd";
import axios from "../../axios";

import { ClinicRoom, HealthFacility, Specialist, User } from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import moment from "moment";
import * as React from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { RegisterForm } from "../auth";
import toast from "react-hot-toast";
const { confirm } = Modal;
import get from "lodash.get";
import isequal from "lodash.isequal";
import { SelectSearchField } from "../form";
import Image from "next/image";
import { BodyModalClinicRoom } from "../body-modal/body.add-edit-clinic-room";

type DataIndex = keyof ClinicRoom;

export function ManagerHealthRoom() {
  // State components
  const [obClinicRoomEdit, setObClinicRoomEdit] =
    React.useState<ClinicRoom | null>();

  const [
    showClinicRoomCreateOrUpdateModal,
    setShowClinicRoomCreateOrUpdateModal,
  ] = React.useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowClinicRoomCreateOrUpdateModal = () => {
    setShowClinicRoomCreateOrUpdateModal((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  async function submitFormCreateOrUpdateClinicRoom({
    capacity,
    roomNumber,
  }: Partial<ReqClinicRoom>): Promise<boolean> {
    const api = healthFacilitiesApi.createOrUpdateHealthRoom({
      capacity,
      healthFacilityId: selectValue || "",
      oldRoomNumber: obClinicRoomEdit?.roomNumber || undefined,
      roomNumber,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      setObClinicRoomEdit(null);
      mutateClinicRooms();
    }
    return isOk;
  }

  function editClinicRoom(record: ClinicRoom): void {
    setObClinicRoomEdit(record);
    toggleShowClinicRoomCreateOrUpdateModal();
  }

  function handleClickDeleteClinicRoom(record: ClinicRoom): void {
    confirm({
      title: `Bạn có muốn xóa phòng khám"${record.roomNumber}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.roomNumber}" và không thể khôi phục`,
      async onOk() {
        const api = healthFacilitiesApi.deleteHealthRoom({
          roomNumber: record.roomNumber,
          healthFacilityId: record.healthFacilityId,
        });
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateClinicRooms();
        return isOk;
      },
      onCancel() {},
    });
  }

  // Table
  const [queryParams, setQueryParams] = React.useState<Partial<ClinicRoom>>({});
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
  const [selectValue, setSelectValue] = React.useState<string | null>(null);
  const [searchHealthSelect, setSearchHealthSelect] = React.useState<
    string | null
  >("");
  const fetcher: BareFetcher<ResDataPaginations<any>> = async ([url, token]) =>
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
        healthFacilityId: selectValue,
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

  const data = React.useMemo<ClinicRoom[]>(() => {
    return responseClinicRooms?.rows.map((clinicRoom: ClinicRoom) => ({
      ...clinicRoom,
      key: "" + clinicRoom.healthFacilityId + clinicRoom.roomNumber,
    }));
  }, [responseClinicRooms]);

  const columns: ColumnsType<ClinicRoom> = React.useMemo(() => {
    return [
      {
        title: "Số phòng",
        dataIndex: "roomNumber",
        key: "roomNumber",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.roomNumber - b.roomNumber,
        ...getColumnSearchProps("roomNumber"),
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
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => editClinicRoom(record)} />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteClinicRoom(record)}
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

  const dataSearch: SelectProps["options"] = responseHealthFacilities?.rows.map(
    (healh: HealthFacility) => ({
      value: healh.id,
      text: (
        <div className="flex align-top gap-2">
          <Image
            className="rounded-full border border-white object-cover w-[32px] h-[32px]"
            alt="Health Facility"
            width={30}
            height={30}
            src={healh?.images?.[0] || ""}
          />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-black">{healh.name}</h4>
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

  function handleSearchSelect(value: string): void {
    setSearchHealthSelect(value);
  }

  function handleChangeSelect(value: string): void {
    setSelectValue(value);
  }

  return (
    <div className="">
      <h3 className="mb-2">Tìm kiếm cơ sở y tế</h3>
      <div className="flex items-center gap-2 ">
        <SelectSearchField
          placeholder="Nhập tên hoặc email cơ sơ y tế"
          data={dataSearch}
          handleSearchSelect={handleSearchSelect}
          handleChangeSelect={handleChangeSelect}
          value={selectValue}
        />
        <span
          className="text-gray-500 cursor-pointer"
          onClick={() => {
            setSelectValue(null);
            setSearchHealthSelect(null);
          }}
        >
          clear
        </span>
      </div>

      <ModalPositionHere
        show={showClinicRoomCreateOrUpdateModal}
        toggle={() => {
          toggleShowClinicRoomCreateOrUpdateModal();
        }}
        width={800}
        footer={false}
        body={
          <BodyModalClinicRoom
            clickCancel={toggleShowClinicRoomCreateOrUpdateModal}
            handleSubmitForm={submitFormCreateOrUpdateClinicRoom}
            obEditClinicRoom={obClinicRoomEdit}
          />
        }
        title={
          obClinicRoomEdit?.roomNumber
            ? `Sửa phòng * ${obClinicRoomEdit.roomNumber} *`
            : "Thêm mới phòng"
        }
      />
      {selectValue && (
        <h3 className="gr-title-admin flex items-center justify-between mt-3  mb-3">
          Quản lý phòng khám
          <BtnPlus
            title="Thêm phòng khám"
            onClick={() => {
              toggleShowClinicRoomCreateOrUpdateModal();
              setObClinicRoomEdit(null);
            }}
          />
        </h3>
      )}
      {data?.length > 0 && selectValue && (
        <>
          <TableSortFilter
            options={{
              sticky: true,
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
        </>
      )}
      {data?.length === 0 && selectValue && (
        <p className="text-gray-500 text-center p-3 mt-4">
          Chưa có phòng khám nào!
        </p>
      )}
    </div>
  );
}
