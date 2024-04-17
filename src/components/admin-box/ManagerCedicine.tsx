"use client";

import { API_ADMIN_CEDICINE } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space, Tag } from "antd";
import axios from "../../axios";

import { adminApi } from "@/api-services";
import { Cedicine } from "@/models";
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
const { confirm } = Modal;

type DataIndex = keyof Cedicine;

export function ManagerCedicine() {
  const [obEditCedicine, setObEditCedicine] =
    useState<Partial<Cedicine> | null>({
      id: "",
      name: "",

      // price: Number.parseFloat(""),
    });
  // Table
  const [queryParams, setQueryParams] = useState<Partial<Cedicine>>({});
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
    mutate: mutateCedicine,
    data: responseCedicine,
    error,
    isLoading: isLoadingFetching,
  } = useSWR<ResDataPaginations<Cedicine>>(
    [
      API_ADMIN_CEDICINE,
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

  const [isShowModalCedicine, setIsShowModalCedicine] =
    useState<boolean>(false);

  // Toggle show modal create or update
  const toggleModalCedicine = () => {
    setIsShowModalCedicine((s) => {
      return !s;
    });
  };

  function handleClickEditCedicine(cedicine: Cedicine): void {
    setObEditCedicine(cedicine);
    toggleModalCedicine();
  }

  async function submitFormCedicine(data: Partial<Cedicine>): Promise<boolean> {
    const api = adminApi.createOrUpdateCecidine(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutateCedicine();
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

  const handleTableChange: TableProps<Cedicine>["onChange"] = (
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
  function handleClickDeleteCedicine(record: Cedicine): void {
    confirm({
      title: `Bạn có muốn xóa thuốc "${record.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.name}" và không thể khôi phục`,
      async onOk() {
        const api = adminApi.deleteCecidine(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateCedicine();
        return isOk;
      },
      onCancel() {},
    });
  }
  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Cedicine> => ({
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

  const data = useMemo<Cedicine[]>(() => {
    return responseCedicine?.rows.map((cedicine: Cedicine) => ({
      ...cedicine,
      key: cedicine.id,
    }));
  }, [responseCedicine]);
  const columns: ColumnsType<Cedicine> = useMemo(() => {
    return [
      {
        title: "Tên thuốc",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
      },
      {
        title: "Mô tả",
        dataIndex: "desc",
        key: "desc",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.desc.localeCompare(b.desc),
        ...getColumnSearchProps("desc"),
      },
      // {
      //   title: "Đơn giá",
      //   dataIndex: "price",
      //   key: "price",
      //   render: (text: number) => (
      //     <Tag className="text-sm" color="blue">
      //       {text.toLocaleString()} vnđ
      //     </Tag>
      //   ),
      //   sorter: (a, b) => a.price - b.price,
      //   // ...getColumnSearchProps("price"),
      // },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="edit"
                onClick={() => handleClickEditCedicine(record)}
              />
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
      <ModalPositionHere
        show={isShowModalCedicine}
        toggle={toggleModalCedicine}
        width={800}
        footer={false}
        body={
          <BodyAddEditCedicine
            handleSubmitForm={submitFormCedicine}
            clickCancel={toggleModalCedicine}
            obEditCedicine={obEditCedicine}
          />
        }
        title={obEditCedicine ? "Sửa thuốc" : "Thêm thuốc"}
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách thuốc chữa bệnh
        <BtnPlus
          title="Thêm thuốc"
          onClick={() => {
            setObEditCedicine(null);
            toggleModalCedicine();
          }}
        />
      </h3>

      <TableSortFilter
        options={{
          loading: isLoadingFetching,
          pagination: {
            total: responseCedicine?.count,
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
