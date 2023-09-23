"use client";

import { doctorApi, healthFacilitiesApi } from "@/api-services";
import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
  API_WORKING,
} from "@/api-services/constant-api";
import { HealthFacility, TypeHealthFacility, Working } from "@/models";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
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
import { BsPlusSquareDotted, BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import get from "lodash.get";
import isequal from "lodash.isequal";
import BodyModalHealth, {
  HealthFacilityClient,
} from "../body-modal/body.add-edit-health";
import { ActionBox, ActionGroup } from "../box";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { BtnPlus } from "../button";
import { ResDataPaginations } from "@/types";
import { BodyModalWorking } from "../body-modal/body.add-edit-working";
const { confirm } = Modal;

type DataIndex = keyof Working;

export function WorkingCurrentTag() {
  const [queryParams, setQueryParams] = React.useState({});
  // Filter search
  const [searchText, setSearchText] = React.useState("");
  const [searchedColumn, setSearchedColumn] = React.useState("");
  const searchInput = React.useRef<InputRef>(null);

  // Pagination
  const [tableParams, setTableParams] = React.useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 8,
    },
  });
  const handleTableChange: TableProps<Working>["onChange"] = (
    pagination,
    filters
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      healthFacilityName: filters?.["HealthFacility.name"] || "",
      doctorEmail: filters?.["Staff.email"] || "",
      doctorName: filters?.["Staff.fullName"] || "",
      id: filters?.id || "",
    }));
    setTableParams({
      pagination,
    });
    mutateWorkings();
  };
  const fetcher: BareFetcher<ResDataPaginations<Working>> = async ([
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

  // Get Working information
  const {
    data: workings,
    isLoading,
    error,
    mutate: mutateWorkings,
  } = useSWR<ResDataPaginations<Working>>(
    [
      API_WORKING,
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
      dedupingInterval: 1000,
    }
  );

  // Get type of health facility

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Working> => ({
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

  const [obEditWorking, setObEditWorking] = React.useState<Working | null>(
    null
  );

  // Edit Working
  function resetObEdit() {
    setObEditWorking(null);
  }
  function handleClickEditWoking(record: Working) {
    setObEditWorking(() => ({ ...record }));
    toggleShowModalAddWorking();
  }
  function handleClickDeleteHealthFacility(record: Working): void {
    confirm({
      title: `Bạn có muốn xóa công tác "${record.id}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.id}" và không thể khôi phục`,
      async onOk() {
        const api = doctorApi.deleteWorking(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateWorkings();
        return isOk;
      },
      onCancel() {},
    });
  }
  //Working
  const columns: ColumnsType<Working> = React.useMemo(
    () => [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => <a>{text}</a>,
        width: "16%",
        ...getColumnSearchProps("id"),
      },
      {
        title: "Tên bác sỉ",
        dataIndex: ["Staff", "fullName"],
        key: "Staff.fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.Staff.fullName.localeCompare(b.Staff.fullName),
        ...getColumnSearchProps(["Staff", "fullName"]),
      },
      {
        title: "Email",
        dataIndex: ["Staff", "email"],
        key: "Staff.email",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.Staff.email.localeCompare(b.Staff.email),
        ...getColumnSearchProps(["Staff", "email"]),
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
        title: "Ngày bắt đầu",
        dataIndex: "startDate",
        key: "startDate",
        render: (text) => <a>{moment(text).locale("vi").format("ll")}</a>,
        sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endDate",
        key: "endDate",
        render: (text) => (
          <a>
            {text ? (
              <span>
                {moment(text).locale("vi").format("ll")}
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-red-400 ml-2"></span>
              </span>
            ) : (
              <span>
                Vô hạn
                <span className="inline-block w-[5px] h-[5px] rounded-full bg-blue-400 ml-2"></span>
              </span>
            )}
          </a>
        ),
        sorter: (a, b) => a.endDate.localeCompare(b.endDate),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="edit"
                onClick={() => handleClickEditWoking(record)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteHealthFacility(record)}
              />
            </ActionGroup>
          );
        },
      },
    ],
    [getColumnSearchProps]
  );

  const data = React.useMemo<Partial<Working>[]>(() => {
    if (!workings?.rows) return [];
    return workings?.rows.map((row: Working) => ({
      key: row.id,
      ...row,
    }));
  }, [workings]);

  const [showModalWorking, setShowModalAddWorking] =
    React.useState<boolean>(false);

  function toggleShowModalAddWorking(): void {
    setShowModalAddWorking((s) => {
      if (s) {
        resetObEdit();
      }
      return !s;
    });
  }

  async function handleSubmitAddWoking(
    data: Partial<Working>
  ): Promise<boolean> {
    let isOk = false;
    let cb = doctorApi.createOrUpdateWorking({
      ...data,
    });
    isOk = await toastMsgFromPromise(cb);
    isOk && mutateWorkings();
    return isOk;
  }

  return (
    <div className="p-4 px-6 col-span-12">
      <ModalPositionHere
        body={
          <BodyModalWorking
            clickCancel={toggleShowModalAddWorking}
            handleSubmitForm={handleSubmitAddWoking}
            obEditWorking={obEditWorking}
          />
        }
        width={760}
        show={showModalWorking}
        title={obEditWorking?.id ? "Chỉnh sửa công tác" : "Thêm mới công tác"}
        toggle={toggleShowModalAddWorking}
        contentBtnSubmit="Thêm"
        footer={false}
      />
      <h3 className="gr-title-admin mb-3 flex items-center justify-between">
        Danh sách các bác sỉ đang công tác
        <BtnPlus
          title="Thêm lịch công tác"
          onClick={toggleShowModalAddWorking}
        />
      </h3>
      <TableSortFilter
        options={{
          sticky: true,
          loading: isLoading,
          pagination: {
            total: workings?.count || 0,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
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
