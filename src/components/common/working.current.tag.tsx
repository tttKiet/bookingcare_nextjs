"use client";

import { doctorApi } from "@/api-services";
import { API_WORKING } from "@/api-services/constant-api";
import { Role, Working } from "@/models";
import { ResDataPaginations } from "@/types";
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
import get from "lodash.get";
import isequal from "lodash.isequal";
import moment from "moment";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import { BodyModalWorking } from "../body-modal/body.add-edit-working";
import { ActionBox, ActionGroup } from "../box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { useMemo, useRef, useState } from "react";
import { Chip } from "@nextui-org/react";
const { confirm } = Modal;

type DataIndex = keyof Working;

export function WorkingCurrentTag() {
  const [queryParams, setQueryParams] = useState({});
  // Filter search
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  // Pagination
  const [tableParams, setTableParams] = useState<{
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
      dedupingInterval: 5000,
      revalidateOnFocus: true,
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

  const [obEditWorking, setObEditWorking] = useState<Working | null>(null);

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
  const columns: ColumnsType<Working> = useMemo(
    () => [
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
        title: "Role",
        dataIndex: ["Staff", "Role"],
        key: "Role",
        render: (role: Role) => {
          if (role.keyType === "doctor") {
            return (
              <a>
                <Chip
                  color="primary"
                  variant="flat"
                  radius="sm"
                  className="font-medium"
                  size="sm"
                >
                  BÁC SĨ
                </Chip>
              </a>
            );
          }
          if (role.keyType === "hospital_manager") {
            return (
              <a>
                <Chip
                  color="secondary"
                  variant="flat"
                  radius="sm"
                  className="font-medium"
                  size="sm"
                >
                  NHÂN VIÊN
                </Chip>
              </a>
            );
          }

          return <a>{role.keyType}</a>;
        },
        filters: [
          {
            text: "Bác sĩ",
            value: "doctor",
          },
          {
            text: "Nhân viên",
            value: "hospital_manager",
          },
        ],
        onFilter: (value: string | number | boolean, record) => {
          return record.Staff.Role.keyType == value;
        },
        // sorter: (a, b) => a.email.localeCompare(b.email),
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
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{moment(text).locale("vi").format("ll")}</a>,
        sorter: (a, b) => a.startDate.localeCompare(b.startDate),
      },
      {
        title: "Trạng thái",
        key: "status",
        render: (text) => (
          <a>
            <Chip variant="flat" color="success" size="sm" radius="sm">
              Hoạt động
            </Chip>
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

  const data = useMemo<Partial<Working>[]>(() => {
    if (!workings?.rows) return [];
    return workings?.rows.map((row: Working) => ({
      key: row.id,
      ...row,
    }));
  }, [workings]);

  const [showModalWorking, setShowModalAddWorking] = useState<boolean>(false);

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
    <div className="col-span-12">
      <ModalPositionHere
        body={
          <BodyModalWorking
            clickCancel={toggleShowModalAddWorking}
            handleSubmitForm={handleSubmitAddWoking}
            obEditWorking={obEditWorking}
          />
        }
        show={showModalWorking}
        title={obEditWorking?.id ? "Chỉnh sửa công tác" : "Thêm mới công tác"}
        toggle={toggleShowModalAddWorking}
        contentBtnSubmit="Thêm"
        footer={false}
      />
      <h3 className="gr-title-admin mb-3 flex items-center justify-between">
        Danh sách công tác của nhân viên
        <BtnPlus
          title="Thêm lịch công tác"
          onClick={toggleShowModalAddWorking}
        />
      </h3>
      <TableSortFilter
        options={{
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
