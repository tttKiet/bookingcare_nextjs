import { HealthExaminationSchedule } from "@/models";
import { Button, Tag } from "antd";
import moment from "moment";

export interface IScheduleBoxProps {
  schedules: string[];
}

export function ScheduleBox({ schedules }: IScheduleBoxProps) {
  return (
    <div className="flex gap-2 justify-end flex-wrap">
      {schedules.map((schedule) => (
        <span key={schedule} className="box-dashed">
          {moment(schedule).format("dddd")}
        </span>
      ))}
    </div>
  );
}
