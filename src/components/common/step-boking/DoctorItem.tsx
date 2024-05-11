import { List, Rate } from "antd";
import { ScheduleBox } from "../schudule.box";
import { WorkRoomAndSchedule } from "./ChooseDoctor";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Avatar, Divider } from "@nextui-org/react";
import male from "../../../assets/images/doctor/male_doctor.png";
import female from "../../../assets/images/doctor/female_doctor.png";
import { MdEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { HiMail, HiPhone } from "react-icons/hi";
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
    <div ref={ref} onClick={() => handleClickCard(workRoomAndSchedule)}>
      <div
        className={`border border-[#F1F5F9]/80 rounded-md p-4 px-6 cursor-pointer shadow
               hover:border-[#F1F5F9] hover:bg-[#F1F5F9] transition-all w-full
               duration-200 ${active && "border-blue-600 bg-[#aec5e67a]"}`}
      >
        <div className="">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-4 flex gap-4 items-center">
              <Avatar
                className="flex-shrink-0"
                src={male.src}
                // description={`${workRoomAndSchedule.Working.Staff.fullName}`}
                // name={`${workRoomAndSchedule.Working.Staff.email}`}
                isBordered
                radius="lg"
                // className="text-left font-bold"
                color="primary"
                size="md"
              ></Avatar>
              <div>
                <h5 className="text-[#1D7ED8] my-0 font-medium">
                  <>#{index + 1}</>
                </h5>
                <h4 className="text-base font-medium text-[#0F172A] my-0">
                  {workRoomAndSchedule.Working.Staff.fullName}
                </h4>
              </div>
            </div>
            <div className="col-span-4 flex flex-col text-sm font-medium text-[#1E293B]">
              <div className="flex space-x-2 items-center ">
                <h4 className="  my-0">
                  {workRoomAndSchedule.Working.Staff.Specialist.name}
                </h4>
                <Divider orientation="vertical" className="h-4" />
                <h4 className="  my-0">
                  {workRoomAndSchedule.Working.Staff.gender == "male"
                    ? "Nam"
                    : "Nữ"}
                </h4>
              </div>
              <div className="flex space-x-2 items-center ">
                <h4 className="  my-0">
                  {workRoomAndSchedule.Working.Staff.AcademicDegree.name}
                </h4>
              </div>
            </div>
            <div className="col-span-4 flex flex-col  text-sm font-medium">
              <div className="flex items-center gap-2 ">
                <span className=" my-0 font-medium">
                  <HiMail color="" size={16} />
                </span>
                <h4 className="   my-0">
                  {workRoomAndSchedule.Working.Staff.email}
                </h4>
              </div>
              <div className="flex items-center gap-2 ">
                <span className=" my-0 font-medium">
                  <HiPhone color="" size={16} />
                </span>
                <h4 className="   my-0">
                  {workRoomAndSchedule.Working.Staff.phone}
                </h4>
              </div>
            </div>

            <div className="col-span-12 flex items-center gap-2 mt-2 text-sm font-medium">
              <span className="text-sm font-medium text-[#1E293B]  ">
                Giá khám:
                <span className="rounded-xl ml-1 text-[#1D7ED8] font-bold">
                  {workRoomAndSchedule.checkUpPrice.toLocaleString()} vnđ
                </span>
              </span>
              <Divider orientation="vertical" className="h-3 mx-5" />
              <span className="text-[30px] font-medium text-[#1E293B]  ">
                {workRoomAndSchedule.starNumber.toPrecision(2)}

                <span className="rounded-xl ml-1 font-bold text-base">
                  <Rate
                    disabled
                    defaultValue={workRoomAndSchedule.starNumber}
                    className="text-[18px] ml-2"
                  />
                </span>
              </span>
            </div>
            <div className="col-span-12 flex items-center gap-2 mt- text-sm font-medium">
              <span className="rounded-xl text-[#1E293B]  text-sm font-medium">
                <span className="mr-2"> Sẳn lịch:</span>
                <ScheduleBox schedules={workRoomAndSchedule.schedules} />
              </span>
            </div>
          </div>
          {/* <div className="">
            <ScheduleBox schedules={workRoomAndSchedule.schedules} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
