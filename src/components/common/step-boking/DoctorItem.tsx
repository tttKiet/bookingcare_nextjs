import { List, Avatar } from "antd";
import * as React from "react";
import { ScheduleBox } from "../schudule.box";
import { WorkRoomAndSchedule } from "./ChooseDoctor";
import { useInView } from "framer-motion";

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
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 100px -50px 0px",
    once: true,
  });
  React.useEffect(() => {
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
      <List.Item.Meta
        className={`border rounded-md p-3 cursor-pointer
               hover:border-blue-600 transition-all 
               duration-200 ${active && "border-blue-600"}`}
        avatar={
          <Avatar
            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
          />
        }
        title={
          <div className="text-left">
            {workRoomAndSchedule.Working.Staff.fullName}
          </div>
        }
        description={
          <div className="grid sm:grid-cols-2 grid-cols-1">
            <div className="text-left">
              {workRoomAndSchedule.Working.Staff.Specialist.name} -{" "}
              {workRoomAndSchedule.Working.Staff.experience}
              <p className="text-gray-600">
                {workRoomAndSchedule.Working.Staff.AcademicDegree.name}
              </p>
              <p className="text-gray-600 mt-1">
                Giá khám:
                <span className="rounded-xl ml-1 text-blue-500 font-medium">
                  {workRoomAndSchedule.checkUpPrice.toLocaleString()} vnđ
                </span>
              </p>
            </div>
            <div className="">
              <ScheduleBox schedules={workRoomAndSchedule.schedules} />
            </div>
          </div>
        }
      />
    </List.Item>
  );
}
