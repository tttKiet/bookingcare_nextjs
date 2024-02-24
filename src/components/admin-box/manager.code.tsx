"use client";

import {
  API_CODE,
  API_HEALTH_FACILITY_ROOM,
} from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { ClinicRoom, Code } from "@/models";
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
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { TableSortFilter } from "../table";
import { ActionBox, ActionGroup } from "../box";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { staffApi } from "@/api-services";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { BodyModalCode } from "../body-modal";
import { useMemo, useRef, useState } from "react";
const { confirm } = Modal;

type DataIndex = keyof Code;

export function ManagerCode() {
  // Table
  const [queryParams, setQueryParams] = useState<Partial<Code>>({});
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
  const fetcher: BareFetcher<ResDataPaginations<Code>> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: responseCode,
    mutate: mutateCode,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Code>>(
    [
      API_CODE,
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
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  const [isShowModalAddCode, setIsShowModalAddCode] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleModalAddCode = () => {
    setIsShowModalAddCode((s) => {
      return !s;
    });
  };

  async function submitCreateCode(data: Code): Promise<boolean> {
    const api = staffApi.createCode(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateCode();
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

  const handleTableChange: TableProps<Code>["onChange"] = (
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
  function handleClickDeleteCode(record: Code): void {
    confirm({
      title: `Bạn có muốn xóa mã "${record.key}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.key}" và không thể khôi phục`,
      async onOk() {
        const api = staffApi.deleteCode(record.key);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateCode();
        return isOk;
      },
      onCancel() {},
    });
  }
  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Code> => ({
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

  const data = useMemo<Code[]>(() => {
    return responseCode?.rows.map((code: Code) => ({
      ...code,
      key: code.key,
    }));
  }, [responseCode]);

  const columns: ColumnsType<Code> = useMemo(() => {
    return [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
      },
      {
        title: "Key",
        dataIndex: "key",
        key: "key",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.key.localeCompare(b.key),
        ...getColumnSearchProps("key"),
      },
      {
        title: "Giá trị",
        dataIndex: "value",
        key: "value",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.value.localeCompare(b.value),
        ...getColumnSearchProps("value"),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteCode(record)}
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
        show={isShowModalAddCode}
        toggle={toggleModalAddCode}
        width={800}
        footer={false}
        body={
          <BodyModalCode
            handleSubmitForm={submitCreateCode}
            clickCancel={toggleModalAddCode}
          />
        }
        title="Thêm code"
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách các mã
        <BtnPlus title="Thêm mã" onClick={toggleModalAddCode} />
      </h3>

      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseCode?.count,
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
