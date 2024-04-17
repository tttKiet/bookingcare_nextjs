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
} from "@nextui-org/react";
import { DeleteIcon } from "../icons/DeleteIcon";
import { EditIcon } from "../icons/EditIcon";
import { ServiceDetails } from "@/models";
import { ActionBox, ActionGroup } from "../box";

export interface TableServiceDetailsProps {
  data: ServiceDetails[] | [];
  handleClickEdit: (serviceDetails: ServiceDetails) => void;
  handleClickDelete: (serviceDetails: ServiceDetails) => void;
}

export default function TableServiceDetails({
  data,
  handleClickEdit,
  handleClickDelete,
}: TableServiceDetailsProps) {
  const columns = [
    { name: "Tên dịch vụ", uid: "name" },
    { name: "Đơn giá", uid: "price" },
    { name: "Kết quả", uid: "result" },
    { name: "Hành động", uid: "actions" },
  ];
  const renderCell = useCallback((data: ServiceDetails, columnKey: any) => {
    switch (columnKey) {
      case "name":
        return <div>{data?.HospitalService?.ExaminationService?.name}</div>;
      case "price":
        return <div>{data?.HospitalService?.price?.toLocaleString()} vnđ</div>;
      case "result":
        return <div>{data?.descriptionResult || "./"} </div>;
      case "actions":
        return (
          //   <div className="relative flex items-center gap-2">
          //     <Tooltip content="Edit user">
          //       <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          //         <EditIcon />
          //       </span>
          //     </Tooltip>
          //     <Tooltip color="danger" content="Delete user">
          //       <span className="text-lg text-danger cursor-pointer active:opacity-50">
          //         <DeleteIcon />
          //       </span>
          //     </Tooltip>
          //   </div>

          <ActionGroup className="justify-start">
            <ActionBox type="edit" onClick={() => handleClickEdit(data)} />
            <ActionBox type="delete" onClick={() => handleClickDelete(data)} />
          </ActionGroup>
        );
      default:
        return "";
    }
  }, []);

  return (
    <Table removeWrapper aria-labelledby="services">
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
      <TableBody items={data}>
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
