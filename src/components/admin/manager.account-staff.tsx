"use client";

import { healthFacilitiesApi, staffApi } from "@/api-services";
import {
  API_ACCOUNT_STAFF,
  API_ROLE,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { Role, Specialist, Staff } from "@/models";
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
import { BodyModalAccountDoctor } from "../body-modal";
import toast from "react-hot-toast";
const { confirm } = Modal;

type DataIndex = keyof Staff;

export interface StaffResColumn extends Staff {
  Specialist: Specialist;
}

export function ManagerAccountStaff() {
  // State components
  const [accountEdit, setAccountEdit] = React.useState<Staff | null>();

  const [showAccountCreateOrUpdateModal, setShowAccountCreateOrUpdateModal] =
    React.useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowAccountCreateOrUpdateModal = () => {
    setShowAccountCreateOrUpdateModal((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  async function submitFormCreateOrUpdateAccount({
    address,
    email,
    id,
    gender,
    phone,
    fullName,
    password,
    academicDegreeId,
    certificate,
    experience,
    specialistId,
  }: Partial<Staff>): Promise<boolean> {
    const api = staffApi.createOrUpdateDoctor({
      address,
      email,
      id,
      gender,
      phone,
      fullName,
      password,
      academicDegreeId,
      certificate,
      experience,
      specialistId,
      roleId: roleDoctor?.id,
    });
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      setAccountEdit(null);
      mutateStaff();
    }
    return isOk;
  }

  function editAccount(record: Staff): void {
    setAccountEdit(record);
    toggleShowAccountCreateOrUpdateModal();
  }

  function handleClickDeleteAccount(record: Staff): void {
    confirm({
      title: `Bạn có muốn xóa tài khoản"${record.fullName}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.fullName}" và không thể khôi phục`,
      async onOk() {
        // const api = Staff.deletePosition({ id: record.id });
        // const isOk = await toastMsgFromPromise(api);
        // isOk && mutateStaff();

        toast("Đang cập nhật");
        return true;
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
  const fetcher: BareFetcher<ResDataPaginations<Staff>> = async ([
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
  const [queryParams, setQueryParams] = React.useState<Partial<Staff>>({
    fullName: "",
    email: "",
  });
  const {
    data: responseStaff,
    mutate: mutateStaff,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Staff>>(
    [
      API_ACCOUNT_STAFF,
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

  const handleTableChange: TableProps<Staff>["onChange"] = (
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Staff> => ({
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

  const { data: role } = useSWR<Role[]>(API_ROLE);

  const roleDoctor: Role | undefined = React.useMemo(
    () => role?.find((roleDoctor) => roleDoctor.keyType === "doctor"),
    [role]
  );

  const data = React.useMemo<Partial<Staff>[]>(() => {
    return responseStaff?.rows.map((staff: StaffResColumn) => ({
      ...staff,
      key: staff.id,
      id: staff.id,
      email: staff.email,
      fullName: staff.fullName,
    }));
  }, [responseStaff]);

  const columnsStaff: ColumnsType<Staff> = React.useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => (
          <a className="text-ellipsis overflow-clip whitespace-nowrap pr-1 block">
            {text}
          </a>
        ),
        width: "120px",
      },
      {
        title: "Tên",
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
        title: "Chuyên khoa",
        dataIndex: ["Specialist", "name"],
        key: "Specialist.name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.email.localeCompare(b.email),
      },
      {
        title: "Học vị",
        dataIndex: ["AcademicDegree", "name"],
        key: "AcadamicDegree.name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.email.localeCompare(b.email),
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
              <ActionBox type="edit" onClick={() => editAccount(record)} />
              <ActionBox
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
    <div className="p-4 px-6">
      <ModalPositionHere
        show={showAccountCreateOrUpdateModal}
        toggle={() => {
          toggleShowAccountCreateOrUpdateModal();
        }}
        width={800}
        footer={false}
        body={
          <BodyModalAccountDoctor
            clickCancel={toggleShowAccountCreateOrUpdateModal}
            handleSubmitForm={submitFormCreateOrUpdateAccount}
            obEditStaff={accountEdit}
          />
        }
        title={
          accountEdit?.id
            ? `Sửa tài khoản * ${accountEdit.email} *`
            : "Thêm mới tài khoản"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Tài khoản bác sỉ
        <BtnPlus
          onClick={() => {
            toggleShowAccountCreateOrUpdateModal();
            setAccountEdit(null);
          }}
        />
      </h3>
      <TableSortFilter
        options={{
          sticky: true,
          loading: isLoading,
          pagination: {
            total: responseStaff?.count,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "12", "24", "50"],
          },
          showSorterTooltip: false,
          onChange: handleTableChange,
        }}
        columns={columnsStaff}
        data={data}
      />
    </div>
  );
}
