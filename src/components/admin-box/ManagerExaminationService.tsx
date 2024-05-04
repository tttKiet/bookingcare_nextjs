"use client";

import {
  API_ADMIN_EXAMINATION_SERVICE,
  API_CODE,
  API_HEALTH_FACILITY_ROOM,
} from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";
import { ExclamationCircleFilled } from "@ant-design/icons";

import { ClinicRoom, Code, ExaminationService } from "@/models";
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
import { adminApi, staffApi } from "@/api-services";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { BodyModalCode } from "../body-modal";
import { useMemo, useRef, useState } from "react";
import { BodyAddEditExaminationService } from "../body-modal/BodyAddEditExaminationService";
import { Tooltip } from "@nextui-org/react";
const { confirm } = Modal;

type DataIndex = keyof ExaminationService;

export function ManagerExaminationService() {
  const [obEdit, setObEdit] = useState<Partial<ExaminationService> | null>({
    id: "",
    name: "",
    description: "",
  });

  // Table
  const [queryParams, setQueryParams] = useState<Partial<ExaminationService>>(
    {}
  );
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
  const fetcher: BareFetcher<ResDataPaginations<ExaminationService>> = async ([
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
    data: responseData,
    mutate: mutate,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<ExaminationService>>(
    [
      API_ADMIN_EXAMINATION_SERVICE,
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

  const [isShowModalAdd, setIsShowModalAdd] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleModalAdd = () => {
    setIsShowModalAdd((s) => {
      return !s;
    });
  };

  async function submitCreate(
    data: Partial<ExaminationService>
  ): Promise<boolean> {
    const api = adminApi.createOrUpdateExaminationService(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      mutate();
    }
    return true;
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

  const handleTableChange: TableProps<ExaminationService>["onChange"] = (
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

  function handleClickEdit(record: ExaminationService): void {
    setObEdit(record);
    toggleModalAdd();
  }

  function handleClickDelete(record: ExaminationService): void {
    confirm({
      title: `Bạn có muốn xóa dịch vụ "${record.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.name}" và không thể khôi phục!`,
      async onOk() {
        const api = adminApi.deleteExaminationService(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutate();
        return isOk;
      },
      onCancel() {},
    });
  }

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<ExaminationService> => ({
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

  const data = useMemo<ExaminationService[]>(() => {
    return responseData?.rows.map((data: ExaminationService) => ({
      ...data,
      key: data.id,
    }));
  }, [responseData]);

  const columns: ColumnsType<ExaminationService> = useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => (
          <a className="">
            <div className=" whitespace-nowrap text-ellipsis w-[120px] overflow-hidden">
              {text}
            </div>
          </a>
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: "160px",
      },
      {
        title: "Tên dịch vụ",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
      },
      {
        title: "Mô tả",
        dataIndex: "description",
        key: "description",
        render: (text) => (
          <div className="">
            <Tooltip
              color={"danger"}
              content={<div className="block max-w-[400px]">{text}</div>}
              className="capitalize"
            >
              <div className="line-clamp-2 font-semibold">{text}</div>
            </Tooltip>
          </div>
        ),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => handleClickEdit(record)} />
              <ActionBox
                type="delete"
                onClick={() => handleClickDelete(record)}
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
        show={isShowModalAdd}
        toggle={toggleModalAdd}
        width={800}
        footer={false}
        body={
          <BodyAddEditExaminationService
            clickCancel={toggleModalAdd}
            handleSubmitForm={submitCreate}
            obEdit={obEdit}
          />
        }
        title={obEdit?.id ? "Sửa thông tin dịch vụ" : "Thêm dịch vụ"}
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách các dịch vụ khám bệnh
        <BtnPlus
          title="Thêm dịch vụ"
          onClick={() => {
            setObEdit(null);
            toggleModalAdd();
          }}
        />
      </h3>

      <TableSortFilter
        options={{
          scroll: { y: 170 },
          loading: isLoading,
          pagination: {
            total: responseData?.count,
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
