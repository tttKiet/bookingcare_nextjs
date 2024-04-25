"use client";

import {
  API_DOCTOR_PATIENT,
  API_HEALTH_FACILITY_ROOM,
  API_PATIENT_PROFILE,
} from "@/api-services/constant-api";
import { Button, Input, InputRef, Modal, Space } from "antd";
import axios from "../../axios";
import { ExclamationCircleFilled } from "@ant-design/icons";

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
import { doctorApi, staffApi } from "@/api-services";
import { BtnPlus } from "../button";
import { ModalPositionHere } from "../modal";
import { useEffect, useMemo, useRef, useState } from "react";
import { Patient, PatientProfile } from "@/models";
import AddressFromApi from "../common/AddressFromApi";
import { BodyAddEditPatient } from "../body-modal/BodyAddEditPatient";
import { useDisclosure } from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";
const { confirm } = Modal;

type DataIndex = keyof Patient;

export function ManagerPatient() {
  const params = useSearchParams();
  const profile = params.get("profile");

  const { data: dataPatientProfile, mutate: mutatePatientProfile } =
    useSWR<PatientProfile>(
      `${API_PATIENT_PROFILE}?patientProfileId=${profile}`,
      {
        revalidateOnMount: false,
      }
    );
  // state modal
  const {
    isOpen: isOpenPatient,
    onOpen: onOpenPatient,
    onClose: onClosePatient,
  } = useDisclosure({ id: "patient-model" });

  // state
  const [obEditPatient, setObEditPatient] = useState<
    Partial<Patient> | undefined
  >();

  // Table
  const [queryParams, setQueryParams] = useState<Partial<Patient>>({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const router = useRouter();
  const [tableParams, setTableParams] = useState<{
    pagination: TablePaginationConfig;
  }>({
    pagination: {
      current: 1,
      pageSize: 6,
    },
  });
  const fetcher: BareFetcher<ResDataPaginations<Patient>> = async ([
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
    data: responsePatient,
    mutate: mutatePatient,
    error,
    isLoading,
  } = useSWR<ResDataPaginations<Patient>>(
    [
      `${API_DOCTOR_PATIENT}`,
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

  const handleTableChange: TableProps<Patient>["onChange"] = (
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
  function handleClickDeletePatient(record: Patient): void {
    confirm({
      title: `Bạn có muốn xóa bệnh nhân "${record.fullName}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${record.fullName}" và không thể khôi phục`,
      async onOk() {
        const api = doctorApi.deletePatient(record.id);
        const isOk = await toastMsgFromPromise(api);
        isOk && mutatePatient();
        return isOk;
      },
      onCancel() {},
    });
  }

  function handleClickEditPatient(record: Patient): void {
    setObEditPatient(record);
    onOpenPatient();
  }
  const getColumnSearchProps = (
    dataIndex: DataIndex | any
  ): ColumnType<Patient> => ({
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

  const data = useMemo<Patient[]>(() => {
    return responsePatient?.rows.map((p: Patient) => ({
      ...p,
      key: p.id,
    }));
  }, [responsePatient]);

  const columns: ColumnsType<Patient> = useMemo(() => {
    return [
      {
        title: "Tên",
        dataIndex: "fullName",
        key: "fullName",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        ...getColumnSearchProps("fullName"),
      },
      {
        title: "CCCD",
        dataIndex: "cccd",
        key: "cccd",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "Email",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Giới tính",
        dataIndex: "gender",
        key: "gender",
        filters: [
          {
            text: "Nam",
            value: "male",
          },
          {
            text: "Nữ",
            value: "famale",
          },
        ],
        onFilter: (value: string | number | boolean, record) => {
          return record.gender == value;
        },
        render: (text) => <a>{text == "male" ? "Nam" : "Nữ"}</a>,
      },
      {
        title: "Ngày sinh",
        dataIndex: "birthday",
        key: "birthday",
        render: (text: any) => <a>{moment(text).format("L")}</a>,
      },
      {
        title: "Nghề nghiệp",
        dataIndex: "profession",
        key: "profession",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Địa chỉ",
        dataIndex: "addressCode",
        key: "addressCode",
        render: (text) => (
          <a>
            <AddressFromApi code={text} />
          </a>
        ),
        width: "220px",
      },
      {
        title: "Hành động",
        key: "action",
        fixed: "right",
        render: (_, record) => {
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="edit"
                onClick={() => handleClickEditPatient(record)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeletePatient(record)}
              />
            </ActionGroup>
          );
        },
        width: "150px",
      },
    ];
  }, [getColumnSearchProps]);

  // function
  async function handleSubmitPatient(data: any): Promise<boolean> {
    // console.log("datadata", data);
    const {
      fullName,
      birthDay,
      cccd,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      district,
      province,
      ward,
    } = data;

    const dataPost: Partial<Patient> = {
      fullName,
      birthDay,
      cccd,
      email,
      gender,
      nation,
      id,
      phone,
      profession,
      addressCode: [ward, district, province],
      // staffId: profile?.id,
    };

    const api = doctorApi.createOrUpdatePatient(dataPost);
    const isOk = await toastMsgFromPromise(api);
    if (isOk) {
      // mutate();
      if (profile) {
        router.replace("/staff/patient");
      }
    }
    mutatePatient();
    return isOk;
  }

  // useEffect
  useEffect(() => {
    if (profile) {
      mutatePatientProfile();
      onOpenPatient();
    }
    if (dataPatientProfile) {
      setObEditPatient({
        birthDay: dataPatientProfile.birthDay,
        cccd: dataPatientProfile.cccd,
        addressCode: dataPatientProfile.addressCode,
        fullName: dataPatientProfile.fullName,
        email: dataPatientProfile.email,
        gender: dataPatientProfile.gender,
        nation: dataPatientProfile.nation,
        phone: dataPatientProfile.phone,
        profession: dataPatientProfile.profession,
      });
    }
  }, [profile, dataPatientProfile]);

  return (
    <div className="">
      <ModalPositionHere
        show={isOpenPatient}
        toggle={onClosePatient}
        footer={false}
        size="4xl"
        body={
          <BodyAddEditPatient
            clickCancel={onClosePatient}
            handleSubmitForm={handleSubmitPatient}
            // getInfoFromProfile={getInfoFromProfile}
            obEditPatient={obEditPatient}
          />
        }
        title="Thêm Patient"
      />
      <h3 className="gr-title-admin flex items-center justify-between  mb-3">
        Danh sách bệnh nhân
        <BtnPlus
          title="Thêm bệnh nhân"
          onClick={() => {
            onOpenPatient();
            setObEditPatient(undefined);
          }}
        />
      </h3>

      <TableSortFilter
        options={{
          loading: isLoading,
          pagination: {
            total: responsePatient?.count,
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
