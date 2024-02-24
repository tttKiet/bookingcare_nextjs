"use client";

import { doctorApi } from "@/api-services";
import { API_ACEDEMIC_DEGREE } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { AcademicDegree } from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import { BodyModalAcademicDegree } from "../body-modal";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import moment from "moment";
import { useMemo, useRef, useState } from "react";
const { confirm } = Modal;

type DataIndex = keyof AcademicDegree;

export function ManagerAcademicDegree() {
  // State components
  const [academicDegreeEdit, setAcademicDegreeEdit] =
    useState<Partial<AcademicDegree> | null>({
      id: "",
      name: "",
    });

  const [
    showAcademicDegreeCreateOrUpdateModal,
    setShowAcademicDegreeCreateOrUpdateModal,
  ] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowAcademicDegreeCreateOrUpdateModal = () => {
    setShowAcademicDegreeCreateOrUpdateModal((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  async function submitFormCreateOrUpdateAcademicDegree(
    data: Partial<AcademicDegree>
  ): Promise<boolean> {
    const api = doctorApi.createOrUpdateAcademicDegree(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      setAcademicDegreeEdit(null);
      mutateAcademicDegree();
    }
    return isOk;
  }

  function editAcademicDegree(record: AcademicDegree): void {
    setAcademicDegreeEdit(record);
    toggleShowAcademicDegreeCreateOrUpdateModal();
  }

  function handleClickDeleteAcademicDegree(record: AcademicDegree): void {
    confirm({
      title: `Bạn có muốn xóa học vị "${record.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.name}" và không thể khôi phục`,
      async onOk() {
        const api = doctorApi.deleteAcademicDegree({ id: record.id });
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateAcademicDegree();
        return isOk;
      },
      onCancel() {},
    });
  }

  // Table
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
  const fetcher: BareFetcher<ResDataPaginations<AcademicDegree>> = async ([
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
    data: responseAcademicDegree,
    mutate: mutateAcademicDegree,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<AcademicDegree>>(
    [
      API_ACEDEMIC_DEGREE,
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

  const handleTableChange: TableProps<AcademicDegree>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<AcademicDegree> => ({
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

  const data = useMemo<Partial<AcademicDegree>[]>(() => {
    return responseAcademicDegree?.rows.map(
      (academicDegree: AcademicDegree) => ({
        ...academicDegree,
        key: academicDegree.id,
        id: academicDegree.id,
        name: academicDegree.name,
      })
    );
  }, [responseAcademicDegree]);

  // Columns
  const columns: ColumnsType<AcademicDegree> = useMemo(() => {
    return [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
        render: (text) => <a>{text}</a>,
        width: "16%",
      },
      {
        title: "Tên học vị",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
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
                type="edit"
                onClick={() => editAcademicDegree(record)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteAcademicDegree(record)}
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
        show={showAcademicDegreeCreateOrUpdateModal}
        toggle={() => {
          toggleShowAcademicDegreeCreateOrUpdateModal();
        }}
        footer={false}
        body={
          <BodyModalAcademicDegree
            clickCancel={toggleShowAcademicDegreeCreateOrUpdateModal}
            handleSubmitForm={submitFormCreateOrUpdateAcademicDegree}
            obAcademicDegreeEdit={academicDegreeEdit}
          />
        }
        title={
          academicDegreeEdit?.id
            ? `Sửa học vị * ${academicDegreeEdit.name} *`
            : "Thêm mới học vị"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        học vị bác sỉ
        <BtnPlus
          onClick={() => {
            toggleShowAcademicDegreeCreateOrUpdateModal();
            setAcademicDegreeEdit(null);
          }}
        />
      </h3>
      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseAcademicDegree?.count,
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
