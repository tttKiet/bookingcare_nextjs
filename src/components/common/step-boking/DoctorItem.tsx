import { List, Avatar } from "antd";
import { ScheduleBox } from "../schudule.box";
import { WorkRoomAndSchedule } from "./ChooseDoctor";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { User } from "@nextui-org/react";

export interface DoctorItemProps {
  workRoomAndSchedule: WorkRoomAndSchedule;
  handleClickCard: (item: WorkRoomAndSchedule) => void;
  active: boolean;
  index: number;
}

export default function DoctorItem({
  workRoomAndSchedule,
  handleClickCard,
  active = false,
  index = 1,
}: DoctorItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 100px -50px 0px",
    once: true,
  });
  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);
  // transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",

  return (
    <List.Item
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(80px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s",
      }}
      onClick={() => handleClickCard(workRoomAndSchedule)}
    >
      <div
        className={`border rounded-md p-3 cursor-pointer
               hover:border-blue-600 transition-all  w-full
               duration-200 ${active && "border-blue-600"}`}
      >
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col justify-start gap-2 items-start">
            <User
              avatarProps={{ radius: "md" }}
              description={`${workRoomAndSchedule.Working.Staff.fullName}`}
              name={`${workRoomAndSchedule.Working.Staff.email}`}
              className="text-left font-bold"
            >
              {workRoomAndSchedule.Working.Staff.fullName}
            </User>

            <div className="text-left">
              {workRoomAndSchedule.Working.Staff.Specialist.name} -{" "}
              {workRoomAndSchedule.Working.Staff.experience}
              <p className="text-gray-600">
                {workRoomAndSchedule.Working.Staff.AcademicDegree.name}
              </p>
              <p className="text-gray-600 mt-1">
                Giá khám:
                <span className="rounded-xl ml-1 text-blue-500 font-bold">
                  {workRoomAndSchedule.checkUpPrice.toLocaleString()} vnđ
                </span>
              </p>
            </div>
          </div>
          <div className="">
            <ScheduleBox schedules={workRoomAndSchedule.schedules} />
          </div>
        </div>
      </div>
    </List.Item>
  );
}
