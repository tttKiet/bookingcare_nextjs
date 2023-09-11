"use client";

import { doctorApi } from "@/api-services";
import { API_POSITION } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { Position } from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import * as React from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { BodyModalPosition } from "../body-modal";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
const { confirm } = Modal;

type DataIndex = keyof Position;

export function ManagerPosition() {
  // State components
  const [positionEdit, setPositionEdit] =
    React.useState<Partial<Position> | null>({
      id: "",
      name: "",
    });

  const [showPositionCreateOrUpdateModal, setShowPositionCreateOrUpdateModal] =
    React.useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowPositionCreateOrUpdateModal = () => {
    setShowPositionCreateOrUpdateModal((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  async function submitFormCreateOrUpdatePosition(
    data: Partial<Position>
  ): Promise<boolean> {
    const api = doctorApi.createOrUpdatePosition(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      setPositionEdit(null);
      mutatePosition();
    }
    return isOk;
  }

  function editPosition(record: Position): void {
    setPositionEdit(record);
    toggleShowPositionCreateOrUpdateModal();
  }

  function handleClickDeletePosition(record: Position): void {
    confirm({
      title: `Bạn có muốn xóa vị trí, danh hiệu "${record.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.name}" và không thể khôi phục`,
      async onOk() {
        const api = doctorApi.deletePosition({ id: record.id });
        const isOk = await toastMsgFromPromise(api);
        isOk && mutatePosition();
        return isOk;
      },
      onCancel() {},
    });
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
  const fetcher: BareFetcher<ResDataPaginations<Position>> = async ([
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
  const {
    data: responsePosition,
    mutate: mutatePosition,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Position>>(
    [
      API_POSITION,
      {
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

  const handleTableChange: TableProps<Position>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Position> => ({
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

  const data = React.useMemo<Partial<Position>[]>(() => {
    return responsePosition?.rows.map((position: Position) => ({
      ...position,
      key: position.id,
      id: position.id,
      name: position.name,
    }));
  }, [responsePosition]);

  // Columns
  const columns: ColumnsType<Position> = React.useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => <a>{text}</a>,
        width: "16%",
      },
      {
        title: "Tên chuyên khoa",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => editPosition(record)} />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeletePosition(record)}
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
        show={showPositionCreateOrUpdateModal}
        toggle={() => {
          toggleShowPositionCreateOrUpdateModal();
        }}
        footer={false}
        body={
          <BodyModalPosition
            clickCancel={toggleShowPositionCreateOrUpdateModal}
            handleSubmitForm={submitFormCreateOrUpdatePosition}
            obPositionEdit={positionEdit}
          />
        }
        title={
          positionEdit?.id
            ? `Sửa vị trí, danh hiệu * ${positionEdit.name} *`
            : "Thêm mới vị trí, danh hiệu"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Vị trí, danh hiệu bác sỉ
        <BtnPlus
          onClick={() => {
            toggleShowPositionCreateOrUpdateModal();
            setPositionEdit(null);
          }}
        />
      </h3>
      <TableSortFilter
        options={{
          sticky: true,
          loading: isLoading,
          pagination: {
            total: responsePosition?.count,
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
