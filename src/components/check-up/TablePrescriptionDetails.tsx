import React, { useCallback } from "react";
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
  Input,
} from "@nextui-org/react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EditIcon } from "../icons/EditIcon";
import { PrescriptionDetail, ServiceDetails } from "@/models";
import { ActionBox, ActionGroup } from "../box";

export interface TablePrescriptionDetailsProps {
  data: PrescriptionDetail[] | [];
  isReadOnly?: boolean;
  handleClickEdit?: (data: PrescriptionDetail) => void;
  handleClickDelete?: (data: PrescriptionDetail) => void;
}
interface PrescriptionDetailIndex extends PrescriptionDetail {
  index: number;
}
export default function TablePrescriptionDetails({
  data,
  handleClickEdit,
  handleClickDelete,
  isReadOnly,
}: TablePrescriptionDetailsProps) {
  const dataTable = data.map((d, i) => ({ ...d, index: i + 1 }));
  const columns = [
    { name: "STT", uid: "STT" },
    { name: "Tên thuốc", uid: "name" },
    { name: "Số lượng", uid: "quantity" },
    { name: "Sáng", uid: "morning" },
    { name: "Trưa", uid: "noon" },
    { name: "Chiều", uid: "afternoon" },
    { name: "Tối", uid: "evening" },
    { name: "Cách dùng", uid: "usage" },
    {
      ...(isReadOnly ? { uid: "test" } : { name: "Hành động", uid: "actions" }),
    },
  ];

  const renderCell = useCallback(
    (data: PrescriptionDetailIndex, columnKey: any) => {
      switch (columnKey) {
        case "STT":
          return <div>{data?.index}</div>;
        case "name":
          return <div>{data?.Cedicine?.name}</div>;

        case "quantity":
          return (
            <div>
              <Chip
                size={"md"}
                className="px-4 py-4"
                color="default"
                radius="sm"
                variant="flat"
              >
                {data?.quantity.toString() || "./"}
              </Chip>
            </div>
          );
        case "morning":
          return (
            <div>
              <Chip
                size={"md"}
                className="px-4 py-4"
                color="default"
                radius="sm"
                variant="flat"
              >
                {data?.morning.toString() || "./"}
              </Chip>
            </div>
          );
        case "noon":
          return (
            <div>
              <Chip
                className="px-4 py-4"
                size={"md"}
                color="default"
                radius="sm"
                variant="flat"
              >
                {data?.noon.toString() || "./"}
              </Chip>
            </div>
          );
        case "afternoon":
          return (
            <div>
              <Chip
                size={"md"}
                className="px-4 py-4"
                color="default"
                radius="sm"
                variant="flat"
              >
                {data?.afterNoon.toString() || "./"}
              </Chip>
            </div>
          );
        case "evening":
          return (
            <div>
              <Chip
                size={"md"}
                className="px-4 py-4"
                color="default"
                radius="sm"
                variant="flat"
              >
                {data?.evening.toString() || "./"}
              </Chip>
            </div>
          );
        case "usage":
          return <div>{data?.usage}</div>;
        case "actions":
          return (
            <ActionGroup className="justify-start">
              <ActionBox
                type="edit"
                onClick={() => handleClickEdit && handleClickEdit(data)}
              />
              <ActionBox
                type="delete"
                onClick={() => handleClickDelete && handleClickDelete(data)}
              />
            </ActionGroup>
          );
        default:
          return "";
      }
    },
    [data]
  );

  return (
    <Table
      removeWrapper
      aria-labelledby="services"
      classNames={{
        th: "text-md",
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={dataTable}>
        {(data) => (
          <TableRow key={data.id}>
            {(columnKey) => (
              <TableCell>{renderCell(data, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
