"use client";

import {
  API_ADMIN_CEDICINE,
  API_REVIEW_DOCTOR,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space, Tag } from "antd";
import axios from "../../axios";

import { adminApi } from "@/api-services";
import { Cedicine, Review } from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import get from "lodash.get";
import isequal from "lodash.isequal";
import { useEffect, useMemo, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { ActionBox, ActionGroup } from "../box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { BodyAddEditCedicine } from "../body-modal";
import moment from "moment";
import { useDisclosure } from "@nextui-org/react";
const { confirm } = Modal;

type DataIndex = keyof Review;

export function ManagerReview() {
  const { isOpen, onOpen, onClose } = useDisclosure({ id: "view" });

  // Table
  const [queryParams, setQueryParams] = useState<Partial<Review>>({});
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
    mutate: mutateReview,
    data: responseReview,
    error,
    isLoading: isLoadingFetching,
  } = useSWR<ResDataPaginations<Review>>(
    [
      API_REVIEW_DOCTOR,
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

  const handleTableChange: TableProps<Review>["onChange"] = (
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
  function handleClickDeleteCedicine(record: Review): void {
    confirm({
      title: `Bạn có muốn xóa đánh giá này không?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả về đánh giá này và không thể khôi phục`,
      async onOk() {
        const api = adminApi.deleteReview(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateReview();
        return isOk;
      },
      onCancel() {},
    });
  }
  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Review> => ({
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

  const data = useMemo<Review[]>(() => {
    return responseReview?.rows.map((data: Review) => ({
      ...data,
      key: data.id,
    }));
  }, [responseReview]);
  const columns: ColumnsType<Review> = useMemo(() => {
    return [
      {
        title: "Bác sĩ",
        dataIndex: ["Staff", "fullName"],
        key: "Staff",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.Staff.fullName.localeCompare(b.Staff.fullName),
        ...getColumnSearchProps(["Staff", "fullName"]),
      },
      {
        title: "Người đánh giá",
        dataIndex: ["User", "fullName"],
        key: "Usder",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.User.fullName.localeCompare(b.User.fullName),
        ...getColumnSearchProps(["User", "fullName"]),
      },
      {
        title: "Nội dung",
        dataIndex: "description",
        key: "description",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: any) => <a>{moment(text).format("L")}</a>,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
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
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách đánh giá
      </h3>

      <TableSortFilter
        options={{
          loading: isLoadingFetching,
          pagination: {
            total: responseReview?.count,
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
