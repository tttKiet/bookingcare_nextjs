import { List, Rate } from "antd";
import { useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Avatar, Divider } from "@nextui-org/react";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";
import { MdEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { HiMail, HiPhone } from "react-icons/hi";
import { WorkRoomAndSchedule } from "./step-boking";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@nextui-org/button";
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

  return (
    <div ref={ref} onClick={() => handleClickCard(workRoomAndSchedule)}>
      <div
        className={`border border-[#F1F5F9]/80 rounded-md p-4 px-6 cursor-pointer shadow
               hover:border-[#F1F5F9] hover:bg-[#F1F5F9] transition-all w-full
               duration-200 ${active && "border-blue-600 bg-[#aec5e67a]"}`}
      >
        <div className="">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-5 flex gap-3 items-center">
              <Avatar
                className="flex-shrink-0"
                src={
                  workRoomAndSchedule.Working.Staff.gender == "male"
                    ? male.src
                    : female.src
                }
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
                <Link
                  href={
                    "/profile-doctor/" + workRoomAndSchedule?.Working?.Staff?.id
                  }
                  className="text-base font-medium text-[#0F172A] my-0 hover:underline transition-all line-clamp-1"
                >
                  {workRoomAndSchedule?.Working?.Staff?.fullName}
                </Link>
              </div>
            </div>
            <div className="col-span-5 flex flex-col text-sm font-medium text-[#1E293B]">
              <div className="flex space-x-2 items-center ">
                <h4 className="  my-0">
                  {workRoomAndSchedule.Working.Staff.AcademicDegree.name}
                </h4>
                <Divider orientation="vertical" className="h-4" />

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
              <span className="text-[18px] mt-1 flex items-center gap-2 font-medium text-[#1E293B]  ">
                {workRoomAndSchedule?.starNumber == 0
                  ? "5.0"
                  : workRoomAndSchedule?.starNumber?.toString()}
                <FaStar color="#d8d900" />
              </span>
            </div>

            <div className="col-span-2 flex flex-col items-end text-sm font-medium text-[#1E293B]">
              <div className="flex justify-end">
                <Button
                  color="primary"
                  size="sm"
                  radius="sm"
                  className="font-medium"
                >
                  Đặt khám
                </Button>
              </div>
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
