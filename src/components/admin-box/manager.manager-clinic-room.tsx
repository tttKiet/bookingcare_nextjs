"use client";

import { ReqClinicRoom, healthFacilitiesApi } from "@/api-services";
import {
  API_HEALTH_FACILITIES,
  API_HEALTH_FACILITY_ROOM,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { ClinicRoom, HealthFacility } from "@/models";
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

import { Image } from "@nextui-org/image";
import get from "lodash.get";
import isequal from "lodash.isequal";
import { useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { BodyModalClinicRoom } from "../body-modal/body.add-edit-clinic-room";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { SelecSearchOptionProps, SelectSearchField } from "../form";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
const { confirm } = Modal;

type DataIndex = keyof ClinicRoom;

export function ManagerHealthRoom() {
  // State components
  const [obClinicRoomEdit, setObClinicRoomEdit] = useState<ClinicRoom | null>();

  const [
    showClinicRoomCreateOrUpdateModal,
    setShowClinicRoomCreateOrUpdateModal,
  ] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowClinicRoomCreateOrUpdateModal = () => {
    setShowClinicRoomCreateOrUpdateModal((s) => {
      return !s;
    });
  };

  async function submitFormCreateOrUpdateClinicRoom({
    capacity,
    roomNumber,
  }: Partial<ReqClinicRoom>): Promise<boolean> {
    const api = healthFacilitiesApi.createOrUpdateHealthRoom({
      capacity,
      healthFacilityId: obClinicRoomEdit?.healthFacilityId || selectValue || "",
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
  // Search health facilities state
  const [selectValue, setSelectValue] = useState<string | null>(null);
  const [searchHealthSelect, setSearchHealthSelect] = useState<string>("");
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
        title: "Cơ sở y tế",
        dataIndex: ["HealthFacility", "name"],
        key: '["HealthFacility", "name"]',
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.roomNumber - b.roomNumber,
        ...getColumnSearchProps(["HealthFacility", "name"]),
      },
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
        render: (_, record: any) => {
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
          name: searchHealthSelect,
        },
      ],
      fetcher,
      {
        revalidateOnMount: true,
        dedupingInterval: 5000,
      }
    );

  const dataSearch: SelecSearchOptionProps[] = useMemo(() => {
    return responseHealthFacilities?.rows.map((healh: HealthFacility) => ({
      value: healh.id,
      startContent: (
        <Image
          className="rounded-full border-spacing-8 border  border-blue-400  object-cover w-[44px] h-[42px]"
          alt="Health Facility"
          width={44}
          height={44}
          src={healh?.images?.[0] || ""}
        />
      ),
      description: (
        <div className="flex align-top gap-2">
          <div className="flex-1">
            {/* <h4 className="text-sm p-y-[1px]  text-blue-600">{healh.na7777777me}</h4> */}
            <div className="flex items-center justify-between gap-x-4">
              <span className="text-xs font-normal text-gray-600">
                {healh.email}
              </span>
              <span className="text-xs font-normal text-right text-gray-500 max-w-[100px] text-ellipsis whitespace-nowrap overflow-hidden">
                {healh.address}
              </span>
            </div>
          </div>
        </div>
      ),
      label: healh.name,
    }));
  }, [responseHealthFacilities]);

  function handleSearchSelect(value: string): void {
    setSearchHealthSelect(value);
  }

  function handleChangeSelect(value: string): void {
    setSelectValue(value);
  }

  return (
    <div className="">
      <div className="flex items-end gap-2 ">
        <SelectSearchField
          title="Tìm kiếm cơ sở y tế"
          placeholder="Nhập tên cơ sở y tế"
          data={dataSearch}
          handleSearchSelect={handleSearchSelect}
          handleChangeSelect={handleChangeSelect}
          value={selectValue}
          isRequired
          // classLabel="text-sm p-y-[1px]  text-blue-600"
        />
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
            ? `Sửa phòng * số: ${obClinicRoomEdit.roomNumber} - ${obClinicRoomEdit?.HealthFacility?.name} * `
            : "Thêm mới phòng"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between mt-3  mb-3">
        Quản lý phòng khám
        <BtnPlus
          disabled={!!!selectValue}
          title="Thêm phòng khám"
          onClick={() => {
            toggleShowClinicRoomCreateOrUpdateModal();
            setObClinicRoomEdit(null);
          }}
        />
      </h3>
      <>
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
      </>
      {data?.length === 0 && selectValue && (
        <p className="text-gray-500 text-center p-3 mt-4">
          Chưa có phòng khám nào!
        </p>
      )}
    </div>
  );
}
