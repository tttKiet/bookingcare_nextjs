"use client";

import { adminApi, healthFacilitiesApi, userApi } from "@/api-services";
import { API_ACCOUNT_USER, API_SPECIALIST } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { Specialist, User } from "@/models";
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
import { useMemo, useRef, useState } from "react";
import { Chip } from "@nextui-org/react";
const { confirm } = Modal;

type DataIndex = keyof User;

export function ManagerBan() {
  function handleClickDeleteAccount(record: User): void {
    confirm({
      title: `Bạn muốn gỡ ban người dùng "${record.fullName}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ gỡ ban cho "${record.fullName}" và họ có thể đặt lịch trở lại!`,
      async onOk() {
        const api = adminApi.deleteBand({ userId: record.id });
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateUser();
        return isOk;
      },
      onCancel() {},
    });
  }

  // Table
  const [queryParams, setQueryParams] = useState<Partial<User>>({
    fullName: "",
    email: "",
  });
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
  const fetcher: BareFetcher<ResDataPaginations<User>> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: responseUser,
    mutate: mutateUser,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<User>>(
    [
      API_ACCOUNT_USER,
      {
        ...queryParams,
        banded: true,
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

  const handleTableChange: TableProps<User>["onChange"] = (
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<User> => ({
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

  const data = useMemo<Partial<User>[]>(() => {
    return responseUser?.rows.map((user: User) => ({
      ...user,
      key: user.id,
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    }));
  }, [responseUser]);

  const columnsUser: ColumnsType<User> = useMemo(() => {
    return [
      {
        title: "Tên người dùng",
        dataIndex: "fullName",
        key: "fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        ...getColumnSearchProps("fullName"),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.email.localeCompare(b.email),
        ...getColumnSearchProps("email"),
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: "Role",
        key: "Role",
        render: (text) => (
          <a>
            <Chip
              color="success"
              variant="flat"
              radius="sm"
              className="font-medium"
              size="sm"
            >
              NGƯỜI DÙNG
            </Chip>
          </a>
        ),
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
      {
        title: "Ban",
        key: "ban",
        dataIndex: "banded",
        render: (text: boolean) => (
          <a>
            <Chip
              color="danger"
              variant="flat"
              radius="sm"
              className="font-medium"
              size="sm"
            >
              {text ? "banded" : "no band"}
            </Chip>
          </a>
        ),
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      },
      {
        title: "Lý do",
        key: "lydo",
        render: (text) => (
          <a>
            Hủy lịch sau thời gian trước 3 ngày của ngày khám{" "}
            <span className="font-bold">(không áp dụng thanh toán online)</span>
          </a>
        ),
        sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
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
              <ActionBox
                content="gở ban"
                type="delete"
                onClick={() => handleClickDeleteAccount(record)}
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
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách tài khoản bị ban
      </h3>
      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseUser?.count,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "12", "24", "50"],
          },
          showSorterTooltip: false,
          onChange: handleTableChange,
        }}
        columns={columnsUser}
        data={data}
      />
    </div>
  );
}
