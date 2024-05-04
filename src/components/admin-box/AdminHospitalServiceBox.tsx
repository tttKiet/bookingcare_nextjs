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
import { HospitalManager, HospitalService } from "@/models";
import { BtnPlus } from "../button";
import { ActionBox, ActionGroup } from "../box";

const columns = [
  { name: "TÊN DỊCH VỤ", uid: "name" },
  { name: "ĐƠN GIÁ", uid: "price" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export interface AdminHospitalServiceBoxProps {
  manager: HospitalService[] | undefined;
  handleClickEdit: (manager: HospitalService) => void;
  handleClickDelete: (manager: HospitalService) => void;
  handleClickAdd: () => void;
}

export default function AdminHospitalServiceBox({
  manager,
  handleClickEdit,
  handleClickAdd,
  handleClickDelete,
}: AdminHospitalServiceBoxProps) {
  const renderCell = React.useCallback(
    (manager: HospitalService, columnKey: any) => {
      switch (columnKey) {
        case "name":
          return <div>{manager.ExaminationService.name}</div>;
        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {manager.price.toLocaleString()} vnđ
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
                  Tạm dừng
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
        Danh sách dịch vụ khám bệnh tại bệnh viện
        <BtnPlus
          title="Thêm dịch vụ"
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
            <TableRow key={m.ExaminationService.id}>
              {(columnKey) => <TableCell>{renderCell(m, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {manager?.length == 0 && (
        <div className="pt-6 text-warning-500 text-center">
          Chưa thêm dịch vụ nào
        </div>
      )}
    </div>
  );
}
