"use client";

import { healthFacilitiesApi } from "@/api-services";
import { API_SPECIALIST } from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";

import { Specialist } from "@/models";
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
import { BodyModalSpecialist } from "../body-modal";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { useMemo, useRef, useState } from "react";
const { confirm } = Modal;

type DataIndex = keyof Specialist;

export function ManagerSpecialist() {
  // State components
  const [specialistEdit, setSecialistEdit] =
    useState<Partial<Specialist> | null>({
      id: "",
      descriptionDisease: "",
      descriptionDoctor: "",
      name: "",
    });

  const [showSpecialistCreateOrUpdate, setShowSpecialistCreateOrUpdate] =
    useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowModalCreateOrUpdate = () => {
    setShowSpecialistCreateOrUpdate((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  async function submitFormCreateOrUpdateSpecialist(
    data: Partial<Specialist>
  ): Promise<boolean> {
    const api = healthFacilitiesApi.createOrUpdateSpecialist(data);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      setSecialistEdit(null);
      mutateSpecialist();
    }
    return isOk;
  }

  function editSpecialist(record: Specialist): void {
    setSecialistEdit(record);
    toggleShowModalCreateOrUpdate();
  }

  function handleClickDeleteSpecialist(record: Specialist): void {
    confirm({
      title: `Bạn có muốn xóa chuyên khoa "${record.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.name}" và không thể khôi phục`,
      async onOk() {
        const api = healthFacilitiesApi.deleteSpecialist({ id: record.id });
        const isOk = await toastMsgFromPromise(api);
        isOk && mutateSpecialist();
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

  const fetcher: BareFetcher<ResDataPaginations<Specialist>> = async ([
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
    data: responseSpecialist,
    mutate: mutateSpecialist,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Specialist>>(
    [
      API_SPECIALIST,
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

  const handleTableChange: TableProps<Specialist>["onChange"] = (
    pagination,
    filters
  ) => {
    setTableParams({
      pagination,
    });
  };

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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<Specialist> => ({
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

  const data = useMemo<Partial<Specialist>[]>(() => {
    return responseSpecialist?.rows?.map((specialist: Specialist) => ({
      ...specialist,
      key: specialist.id,
      id: specialist.id,
      name: specialist.name,
      descriptionDisease: specialist.descriptionDisease,
      descriptionDoctor: specialist.descriptionDoctor,
      createdAt: specialist.createdAt,
    }));
  }, [responseSpecialist]);

  // Columns
  const columns: ColumnsType<Specialist> = useMemo(() => {
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
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{moment(text).calendar()}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        // ...getColumnSearchProps("createdAt"),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => editSpecialist(record)} />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteSpecialist(record)}
              />
            </ActionGroup>
          );
        },
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <div className="">
      <ModalPositionHere
        show={showSpecialistCreateOrUpdate}
        toggle={() => {
          toggleShowModalCreateOrUpdate();
        }}
        footer={false}
        body={
          <BodyModalSpecialist
            clickCancel={toggleShowModalCreateOrUpdate}
            handleSubmitForm={submitFormCreateOrUpdateSpecialist}
            obEditSpecialist={specialistEdit}
          />
        }
        width={720}
        title={
          specialistEdit?.id
            ? `Sửa chuyên khoa * ${specialistEdit.name} *`
            : "Thêm mới chuyên khoa"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Chuyên khoa
        <BtnPlus
          onClick={() => {
            toggleShowModalCreateOrUpdate();
            setSecialistEdit(null);
          }}
        />
      </h3>
      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseSpecialist?.count,
            pageSize: tableParams.pagination.pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["3", "6", "12", "24", "50"],
          },
          onChange: handleTableChange,
          showSorterTooltip: false,
          expandedRowRender: (record) => (
            <div className="m-0 px-4 mx-[32px]">
              <div className="grid grid-cols-2 gap-4  text-[rgba(0, 0, 0, 0.88)] rounded-lg shadow-sm ">
                <div className="">
                  <h4 className="text-black mb-3 font-medium">
                    Mô tả căn bệnh
                  </h4>
                  <p className="mx-[-30px] p-[30px] p-y-[20px] rounded bg-white rounded-l-lg">
                    {record.descriptionDisease}
                  </p>
                </div>
                <div>
                  <h4 className="text-black mb-3 font-medium">
                    Mô tả Bác sĩ chửa bệnh
                  </h4>
                  <p className="mx-[-30px] p-[30px] p-y-[20px] rounded bg-white rounded-r-lg">
                    {record.descriptionDoctor}
                  </p>
                </div>
              </div>
            </div>
          ),
        }}
        columns={columns}
        data={data}
      />
    </div>
  );
}
