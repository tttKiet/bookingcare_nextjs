"use client";
import { healthFacilitiesApi } from "@/api-services";
import { API_TYPE_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { TypeHealthFacility } from "@/models";
import { getErrorMessage } from "@/untils";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { BsPlusSquareDotted } from "react-icons/bs";
import useSWR from "swr";
import { BodyTypeHealth } from "../body-modal";
import { ActionGroup } from "../box";
import { ActionBox } from "../box/action.box";
import { ModalPositionHere } from "../modal";
import { BtnPlus } from "../button";
import { Fragment, useMemo, useState } from "react";
import { TableSortFilter } from "../table";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
const { confirm } = Modal;
export interface ManagerTypeHealthFacilitesProps {}

export function ManagerTypeHealthFacilites(
  props: ManagerTypeHealthFacilitesProps
) {
  const {
    data: types,
    mutate: mutateTypeHealth,
    error,
    isLoading,
  } = useSWR(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  const [typeHealthEdit, setTypeHealthEdit] = useState<TypeHealthFacility>({
    id: "",
    name: "",
    createdAt: "",
    updatedAt: "",
  });
  const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function toggleShowModalType(): void {
    setShowTypeModal((s) => !s);
  }

  function setDefaultTypeHealth() {
    setTypeHealthEdit({
      id: "",
      createdAt: "",
      name: "",
      updatedAt: "",
    });
  }

  async function handleSubmitFormTypeHealth({
    name,
    id,
  }: {
    name: string;
    id?: string;
  }): Promise<boolean> {
    try {
      setLoading(true);
      let res;
      if (id) {
        res = await healthFacilitiesApi.updateTypeHealthFacility({
          nameUpdated: name,
          id,
        });
      } else {
        res = await healthFacilitiesApi.createTypeHealthFacility({ name });
      }
      if (res.statusCode === 0) {
        toast.success(res.msg, {
          position: "top-right",
        });
        toggleShowModalType();
        mutateTypeHealth();
        return true;
      } else {
        toast.error(res.msg, {
          position: "top-right",
        });
      }
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg, {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
    return false;
  }

  function handleClickEditTypeHealth(type: TypeHealthFacility): void {
    setTypeHealthEdit(type);
    toggleShowModalType();
  }

  function handleClickDeleteTypeHealth(type: TypeHealthFacility): void {
    confirm({
      title: `Bạn có muốn xóa loại "${type.name}"?`,
      icon: <ExclamationCircleFilled />,
      content: `Thao tác này sẽ xóa tất cả dữ liệu về "${type.name}" và không thể khôi phục`,
      async onOk() {
        return healthFacilitiesApi
          .deleteTypeHealthFacility({ id: type.id })
          .then((res) => {
            if (res.statusCode === 0) {
              toast.success(res.msg);
              return mutateTypeHealth();
            } else {
              return toast.error(res.msg);
            }
          })
          .catch((err) => {
            const msg = getErrorMessage(err);
            return toast.error(msg);
          });
      },
      onCancel() {},
    });
  }

  const columns: ColumnsType<TypeHealthFacility> = useMemo(() => {
    return [
      {
        title: "Tên loại",
        dataIndex: "name",
        key: "name",
        render: (text) => <a>{text}</a>,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },

      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text) => <a>{text && moment(text).format("L")}</a>,
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => {
          return (
            // <ActionGroup className="justify-start">
            //   <ActionBox type="edit" onClick={() => editWorkRoom(record)} />
            //   <ActionBox
            //     type="delete"
            //     onClick={() => handleDeleteWorkRoom(record)}
            //   />
            // </ActionGroup>

            <ActionGroup>
              <ActionBox
                type="edit"
                onClick={() => handleClickEditTypeHealth(record)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDeleteTypeHealth(record)}
              />
            </ActionGroup>
          );
        },
        width: "150px",
      },
    ];
  }, []);

  return (
    <div className="p-4 px-6">
      <ModalPositionHere
        show={showTypeModal}
        toggle={() => {
          toggleShowModalType();
          setDefaultTypeHealth();
        }}
        footer={false}
        body={
          <BodyTypeHealth
            typeHealthEdit={typeHealthEdit}
            loading={loading}
            clickCancel={() => {
              toggleShowModalType();
              setDefaultTypeHealth();
            }}
            handleSubmitForm={handleSubmitFormTypeHealth}
          />
        }
        title={
          typeHealthEdit?.id
            ? `Sửa loại bệnh viện * ${typeHealthEdit.name} *`
            : "Thêm loại bệnh viện"
        }
      />
      <h3 className="gr-title-admin flex items-center justify-between mb-4">
        Loại bệnh viện
        <BtnPlus onClick={toggleShowModalType} />
      </h3>
      <div className="mt-3 ">
        {/* {types && types.length > 0 ? (
          <>
            <div className="text-sm text-black mb-2 grid grid-cols-12 gap-1">
              <Fragment>
                <span className="max-w-[100px] col-span-4 font-bold overflow-hidden whitespace-nowrap mr-2 ">
                  ID
                </span>
                <span className="col-span-8 font-bold text-pink-500">
                  Tên loại
                </span>
              </Fragment>
              {types.map((type: TypeHealthFacility) => (
                <Fragment key={type.id}>
                  <span
                    title={type.id}
                    className="max-w-[100px] p-2 px-0 col-span-4 text-ellipsis overflow-hidden whitespace-nowrap mr-2 "
                  >
                    {type.id}
                  </span>
                  <span className="col-span-8">
                    <div className="flex justify-between items-center gap-2">
                      <span className="font-medium flex-1 text-pink-500">
                        {type.name}
                      </span>
                      <ActionGroup>
                        <ActionBox
                          type="edit"
                          onClick={() => handleClickEditTypeHealth(type)}
                        />
                        <ActionBox
                          type="delete"
                          onClick={() => handleClickDeleteTypeHealth(type)}
                        />
                      </ActionGroup>
                    </div>
                  </span>
                </Fragment>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-base font-medium text-red-500">
            Chưa có loại bệnh viện nào.
          </p>
        )} */}
        <TableSortFilter
          options={{
            loading: isLoading,
            pagination: {
              total: types?.length,
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["3", "6", "12", "24", "50"],
            },
          }}
          columns={columns}
          data={types || []}
        />
      </div>
    </div>
  );
}
