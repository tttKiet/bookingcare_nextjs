import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EditIcon } from "../icons/EditIcon";
import { EyeIcon } from "../icons/EyeIcon";
import { HospitalManager } from "@/models";
import { BtnPlus } from "../button";
import { ActionBox, ActionGroup } from "../box";

const columns = [
  { name: "Tên nhân viên", uid: "name" },
  { name: "Thông tin", uid: "email" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export interface AdminManagerBoxProps {
  manager: HospitalManager[] | undefined;
  handleClickEdit: (manager: HospitalManager) => void;
  handleClickDelete: (manager: HospitalManager) => void;
  handleClickAdd: () => void;
}

export default function AdminManagerBox({
  manager,
  handleClickEdit,
  handleClickAdd,
  handleClickDelete,
}: AdminManagerBoxProps) {
  const renderCell = React.useCallback(
    (manager: HospitalManager, columnKey: any) => {
      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg" }}
              description="admin"
              name={manager.Staff.fullName}
            >
              {manager.Staff.fullName}
            </User>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {manager.Staff.email}
              </p>
              <p className="text-bold text-sm capitalize text-default-400">
                {manager.Staff.gender == "1" ? "Nam" : "Nữ"}
              </p>
            </div>
          );
        case "status":
          return (
            <>
              {manager.isAcctive ? (
                <Chip
                  className="capitalize"
                  color={"primary"}
                  size="sm"
                  variant="flat"
                >
                  Hoạt động
                </Chip>
              ) : (
                <Chip
                  className="capitalize"
                  color={"warning"}
                  size="sm"
                  variant="flat"
                >
                  Đã dừng
                </Chip>
              )}
            </>
          );
        case "actions":
          return (
            <ActionGroup className="justify-start">
              <ActionBox type="edit" onClick={() => handleClickEdit(manager)} />
              <ActionBox
                type="delete"
                onClick={() => handleClickDelete(manager)}
              />
            </ActionGroup>
          );
        default:
          return "Lỗi";
      }
    },
    []
  );

  return (
    <div>
      <h3 className="gr-title-admin mb-3 flex items-center justify-between">
        Danh sách quản lý
        <BtnPlus
          title="Thêm quản lý"
          onClick={() => {
            handleClickAdd();
          }}
        />
      </h3>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={manager}>
          {(m) => (
            <TableRow key={m.Staff.id}>
              {(columnKey) => <TableCell>{renderCell(m, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
