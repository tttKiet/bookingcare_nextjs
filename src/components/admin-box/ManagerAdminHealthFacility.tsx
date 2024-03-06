"use client";

import { doctorApi } from "@/api-services";
import {
  API_ACEDEMIC_DEGREE,
  API_ADMIN_MANAGER_ADMIN_HEALTH,
} from "@/api-services/constant-api";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Input, InputRef, Modal, Space, Tag } from "antd";
import axios from "../../axios";

import {
  AcademicDegree,
  HealthFacility,
  HospitalManager,
  ResManagerAdmin,
} from "@/models";
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
import { useEffect, useMemo, useRef, useState } from "react";
import get from "lodash.get";
import isEqual from "lodash.isequal";
import { EyeActionBox } from "../box/EyeActionBox.";
import { BodyManagerAdminHealth } from "../body-modal/BodyManagerAdminHealth";
import { Chip } from "@nextui-org/react";
const { confirm } = Modal;

type DataIndex = keyof ResManagerAdmin;

export function ManagerAdminHealthFacility() {
  // State components
  const [hospitalManagerViewer, setHospitalManagerViewer] = useState<
    ResManagerAdmin | null | undefined
  >(null);

  const [showModalDetails, setShowModalDetails] = useState<boolean>(false);

  // Toggle show modal create or update
  const toggleShowModalDetails = () => {
    setShowModalDetails((s) => {
      // s && setSecialistEdit(null);
      return !s;
    });
  };

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [queryParams, setQueryParams] = useState<{}>({
    healthFacilityEmail: "",
    healthFacilityName: "",
  });
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
    data: responseManagerAdmin,
    mutate: mutateManagerAdmin,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<ResManagerAdmin>>(
    [
      API_ADMIN_MANAGER_ADMIN_HEALTH,
      {
        limit: tableParams.pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset:
          ((tableParams.pagination.current || 0) - 1) *
          (tableParams.pagination.pageSize || 0),
        ...queryParams,
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

    setQueryParams((prev) => {
      return {
        healthFacilityEmail: filters["healthFacility.email"],
        healthFacilityName: filters["healthFacility.name"],
      };
    });
  };

  const handleClickView = (record: ResManagerAdmin) => {
    console.log(record);
    setHospitalManagerViewer(record);
    toggleShowModalDetails();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<ResManagerAdmin> => ({
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
      return isEqual(searchedColumn, dataIndex) ? (
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

  const data = useMemo<ResManagerAdmin[]>(() => {
    return responseManagerAdmin?.rows?.map((d: ResManagerAdmin) => ({
      ...d,
      key: d.healthFacility.id,
    }));
  }, [responseManagerAdmin]);

  // Columns
  const columns: ColumnsType<ResManagerAdmin> = useMemo(() => {
    return [
      {
        title: "Tên bệnh viện",
        dataIndex: ["healthFacility", "name"],
        key: "healthFacility.name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.healthFacility.name.localeCompare(b.healthFacility.name),
        ...getColumnSearchProps(["healthFacility", "name"]),
      },
      {
        title: "Email",
        dataIndex: ["healthFacility", "email"],
        key: "healthFacility.email",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) =>
          a.healthFacility.email.localeCompare(b.healthFacility.email),
        ...getColumnSearchProps(["healthFacility", "email"]),
      },
      {
        title: "Số nhân viên quản lý",
        dataIndex: "managerCount",
        key: "managerCount",
        render: (text: number) => (
          <a>
            <Chip
              className="capitalize"
              color={"primary"}
              size="sm"
              variant="flat"
            >
              {text} nhân viên
            </Chip>
          </a>
        ),
      },
      {
        title: "Hoạt động",
        key: "active",
        render: (d) => {
          const count = d.manager.filter(
            (m: HospitalManager) => m.isAcctive
          ).length;

          return (
            <a>
              <Chip
                className="capitalize"
                color={"success"}
                size="sm"
                variant="flat"
              >
                {count} nhân viên
              </Chip>
            </a>
          );
        },
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <EyeActionBox
                onClick={() => {
                  handleClickView(record);
                }}
              />
            </ActionGroup>
          );
        },
      },
    ];
  }, [getColumnSearchProps]);

  function refresh() {
    mutateManagerAdmin();
  }
  useEffect(() => {
    setHospitalManagerViewer((prev) => {
      const newUpdate = data?.find(
        (h) => h?.healthFacility?.id === prev?.healthFacility?.id
      );
      return newUpdate;
    });
  }, [data]);

  return (
    <div className="mt-2">
      <ModalPositionHere
        show={showModalDetails}
        toggle={() => {
          toggleShowModalDetails();
        }}
        config={{ zIndex: 40 }}
        width={800}
        footer={false}
        body={
          <BodyManagerAdminHealth
            refresh={refresh}
            hospitalManagerViewer={hospitalManagerViewer}
          />
        }
        title="Thông tin quản lý của của cơ sở y tế"
      />

      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responseManagerAdmin?.count,
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
