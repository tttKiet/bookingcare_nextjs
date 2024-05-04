"use client";
import { healthFacilitiesApi } from "@/api-services";
import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/constant-api";
import { HealthFacility, TypeHealthFacility } from "@/models";
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
import moment from "moment";
import Highlighter from "react-highlight-words";
import { BsPlusSquareDotted, BsSearch } from "react-icons/bs";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import BodyModalHealth, {
  HealthFacilityClient,
} from "../body-modal/body.add-edit-health";
import { ActionBox, ActionGroup } from "../box";
import { ModalPositionHere } from "../modal";
import { TableSortFilter } from "../table";
import { BtnPlus } from "../button";
import { useMemo, useRef, useState } from "react";
import AddressFromApi from "../common/AddressFromApi";
import BodyAddEditHealthMarkdown from "../body-modal/BodyAddEditMarkdown";
import BodyAddEditMarkdown from "../body-modal/BodyAddEditMarkdown";
const { confirm } = Modal;

export interface HealthFacilitiesBoxProps {}

export interface HealthFacilityColumns extends HealthFacility {
  typeHealthFacility: string;
}

type DataIndex = keyof HealthFacilityColumns;

export interface ResHealthFacilitiesBox {
  count: number;
  rows: HealthFacility[];
}
export function HealthFacilitiesPage(props: HealthFacilitiesBoxProps) {
  const [queryParams, setQueryParams] = useState<
    Partial<HealthFacilityColumns>
  >({
    name: "",
    address: "",
    typeHealthFacility: "",
  });
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
  const handleTableChange: TableProps<HealthFacilityColumns>["onChange"] = (
    pagination,
    filters
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
    }));
    setTableParams({
      pagination,
    });
  };
  const fetcher: BareFetcher<ResHealthFacilitiesBox> = async ([url, token]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;

  // Get health facilities information
  const {
    data: healthFacilities,
    isLoading,
    error,
    mutate: mutateHealthFacilities,
  } = useSWR<ResHealthFacilitiesBox>(
    [
      API_HEALTH_FACILITIES,
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
      dedupingInterval: 1000,
    }
  );

  // Get type of health facility
  const {
    data: types,
    mutate: mutateTypeHealth,
    isLoading: loadingType,
  } = useSWR(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });
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
    dataIndex: DataIndex
  ): ColumnType<HealthFacilityColumns> => ({
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

  const [obEditHealthFacility, setObEditHealthFacility] =
    useState<HealthFacilityColumns | null>(null);

  // Edit Health Facility
  function resetObEdit() {
    setObEditHealthFacility(null);
  }
  function handleClickEditHealthFacility(record: HealthFacilityColumns) {
    setObEditHealthFacility(() => ({ ...record }));
    toggleShowModalAddHealthFacility();
  }

  //HealthFacilityColumns
  const columns: ColumnsType<HealthFacilityColumns> = useMemo(
    () => [
      {
        title: "Tên",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
        ...getColumnSearchProps("name"),
      },
      {
        title: "Page",
        dataIndex: "markdownContent",
        key: "markdownContent",
        render: (text) => <a>{text}</a>,
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
                onClick={() => handleClickEditHealthFacility(record)}
              />
            </ActionGroup>
          );
        },
      },
    ],
    [types, getColumnSearchProps]
  );

  const data = useMemo<Partial<HealthFacility>[]>(() => {
    if (!healthFacilities?.rows) return [];
    return healthFacilities?.rows.map((row, index) => ({
      key: row.id,
      ...row,
      id: row.id,
      name: row.name,
      address: row.address,
      typeHealthFacility: row.TypeHealthFacility.name,
      createdAt: row.createdAt,
      phone: row.phone,
      email: row.email,
      images: row.images,
      typeHealthFacilityId: row.typeHealthFacilityId,
    }));
  }, [healthFacilities?.rows, healthFacilities]);

  const [showModalAddHealth, setShowModalAddHealth] = useState<boolean>(false);

  function toggleShowModalAddHealthFacility(): void {
    setShowModalAddHealth((s) => {
      if (s) {
        resetObEdit();
      }
      return !s;
    });
  }

  async function handleSubmitMarkDown(data: {
    html: string;
    text: string;
  }): Promise<boolean> {
    const cb = healthFacilitiesApi.updateHealthMarkdown({
      ...data,
      healthFacilityId: obEditHealthFacility?.id || "",
    });
    const isOk = await toastMsgFromPromise(cb);
    isOk && mutateHealthFacilities();
    return isOk;
  }

  return (
    <div className="mt-2">
      <ModalPositionHere
        size="5xl"
        body={
          <BodyAddEditMarkdown
            onSubmit={handleSubmitMarkDown}
            clickCancel={toggleShowModalAddHealthFacility}
            obEdit={{
              text: obEditHealthFacility?.markdownContent || "",
              html: obEditHealthFacility?.markdownHtml || "",
            }}
          />
        }
        show={showModalAddHealth}
        title={
          obEditHealthFacility?.id
            ? "Chỉnh sửa lời giới thiệu cơ sở y tế"
            : "Tạo lời giới thiệu cơ sở y tế"
        }
        toggle={toggleShowModalAddHealthFacility}
        contentBtnSubmit="Thêm"
        footer={false}
      />
      <h3 className="gr-title-admin mb-3 flex items-center justify-between">
        Chi tiết lời giới thiệu cơ sở y tế
      </h3>
      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: healthFacilities?.count || 0,
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
