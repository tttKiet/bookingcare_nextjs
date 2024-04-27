import { HealthExaminationSchedule } from "@/models";
import { Chip } from "@nextui-org/react";
import { Button, Tag } from "antd";
import moment from "moment";

export interface IScheduleBoxProps {
  schedules: string[];
}

export function ScheduleBox({ schedules }: IScheduleBoxProps) {
  return (
    <div className="inline-flex  gap-2 items-center flex-wrap">
      {schedules.map((schedule) => (
        <Chip
          key={schedule}
          color="primary"
          size="sm"
          radius="sm"
          variant="flat"
        >
          {moment(schedule).format("dddd")}
        </Chip>
      ))}
    </div>
  );
}
