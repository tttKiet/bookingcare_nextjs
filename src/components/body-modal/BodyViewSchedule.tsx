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
import { EyeIcon } from "../icons/EyeIcon";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { ResAdminHealthExaminationSchedule, StaffAndSchedule } from "@/models";
import { ActionBox, ActionGroup } from "../box";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

type StaffAndScheduleKey =
  | "staff"
  | "schedule"
  | "actions"
  | "healthFacility"
  | "status";

interface Columns {
  name: string;
  uid: StaffAndScheduleKey;
}

const columns: Columns[] = [
  { name: "Bác sĩ", uid: "staff" },
  { name: "CƠ SỞ", uid: "healthFacility" },
  { name: "KHUNG GIỜ", uid: "schedule" },
  { name: "ACTIONS", uid: "actions" },
];

export interface BodyViewScheduleProps {
  viewData: ResAdminHealthExaminationSchedule | null;
  handleClickEdit: (
    workingId: string,
    date: string | Object | Date | undefined | null,
    staffId: string
  ) => void;
  date: string | Object | Date | undefined | null;
}

export default function BodyViewSchedule({
  viewData,
  handleClickEdit,
  date,
}: BodyViewScheduleProps) {
  const renderCell = useCallback(
    (staffAndSchedule: StaffAndSchedule, columnKey: any) => {
      console.log("staffAndSchedule", staffAndSchedule);
      switch (columnKey) {
        case "staff":
          return (
            <User
              avatarProps={{ radius: "lg" }}
              description={staffAndSchedule.working.Staff.email}
              name={staffAndSchedule.working.Staff.fullName}
            >
              {staffAndSchedule.working.Staff.fullName}
            </User>
          );

        case "healthFacility":
          return (
            <div className="flex flex-col">
              {staffAndSchedule.working.HealthFacility.name}
            </div>
          );
        case "schedule":
          return (
            <div className="flex flex-col">
              <Tooltip
                placement="bottom-end"
                showArrow={true}
                content={
                  <div className="px-1 py-2 max-w-[300px]">
                    <div className="text-small font-bold">Lịch khám</div>
                    <div className="mt-2">
                      <div className="flex gap-3  flex-wrap">
                        {staffAndSchedule.schedules.map((sch) => (
                          <Chip key={sch.id} color="default">
                            <span>{sch.TimeCode.value}</span> /{" "}
                            <span>max {sch.maxNumber}</span>
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>
                }
              >
                <Chip color="primary" variant="flat">
                  +{staffAndSchedule.schedules.length} khung giờ
                </Chip>
              </Tooltip>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color="secondary"
              size="sm"
              variant="flat"
            >
              Hoạt động
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ActionGroup className="justify-start">
                <ActionBox
                  type="edit"
                  onClick={() => {
                    console.log(
                      "body",
                      staffAndSchedule.working.id,
                      date,
                      staffAndSchedule.working.staffId
                    );
                    handleClickEdit(
                      staffAndSchedule.working.id,
                      date,
                      staffAndSchedule.working.staffId
                    );
                  }}
                />
              </ActionGroup>
            </div>
          );
        default:
          return <div></div>;
      }
    },
    [date, viewData, viewData?.date]
  );

  return (
    <div className="pt-4">
      <Table aria-label="Example table with custom cells">
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
        <TableBody items={viewData?.data || []}>
          {(item) => (
            <TableRow key={item.working.Staff.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
