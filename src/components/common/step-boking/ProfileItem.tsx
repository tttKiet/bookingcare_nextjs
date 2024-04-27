import { List, Rate } from "antd";
import { ScheduleBox } from "../schudule.box";
import { WorkRoomAndSchedule } from "./ChooseDoctor";
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Avatar, Chip, Divider } from "@nextui-org/react";
import male from "../../../assets/images/doctor/male_doctor.png";
import female from "../../../assets/images/doctor/female_doctor.png";
import { MdEmail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import { HiMail, HiPhone } from "react-icons/hi";
import { PatientProfile } from "@/models";
import { calculateAge } from "@/untils/common";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { PulseLoader } from "react-spinners";
import { CiLocationOn } from "react-icons/ci";
export interface ProfileItemProps {
  patientProfile: PatientProfile;
  handleClickCard: (item: PatientProfile) => void;
  active: boolean;
  index: number;
}

export default function ProfileItem({
  patientProfile,
  handleClickCard,
  active = false,
  index = 1,
}: ProfileItemProps) {
  const [address, setAddress] = useState<string>("");
  const ref = useRef(null);
  const isInView = useInView(ref, {
    margin: "0px 100px -50px 0px",
    once: true,
  });
  useEffect(() => {
    console.log("Element is in view: ", isInView);
  }, [isInView]);

  useEffect(() => {
    useGetAddress({
      wardCode: patientProfile?.addressCode[0] || "",
      districtCode: patientProfile?.addressCode[1] || "",
      provinceCode: patientProfile?.addressCode[2] || "",
    })
      .then((ob) => setAddress(ob.values.province))
      .catch((e) => "");
  }, [
    patientProfile?.addressCode[0],
    patientProfile?.addressCode[1],
    patientProfile?.addressCode[2],
  ]);

  return (
    <div
      ref={ref}
      onClick={() => handleClickCard(patientProfile)}
      className="mb-3"
    >
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
                  {patientProfile.fullName}
                </h4>
              </div>
            </div>
            <div className="col-span-4 flex flex-col text-sm font-medium text-[#1E293B]">
              <div className="flex space-x-2 items-center ">
                <h4 className="  my-0">{patientProfile.cccd}</h4>
                <Divider orientation="vertical" className="h-4" />
                <h4 className="  my-0">
                  {patientProfile.gender == "male" ? "Nam" : "Nữ"}
                </h4>
                <Divider orientation="vertical" className="h-4" />

                <span>{calculateAge(patientProfile.birthDay)} tuổi</span>
              </div>
              <div className="flex space-x-2 items-center mt-2">
                <h4 className="  my-0">
                  <span className="mr-2">Dân tộc:</span>
                  {patientProfile.nation}
                </h4>
              </div>
            </div>
            <div className="col-span-4 flex flex-col  text-sm font-medium">
              <div className="flex items-center gap-2 ">
                <span className=" my-0 font-medium">
                  <HiPhone color="" size={16} />
                </span>
                <h4 className=" my-0">{patientProfile.phone}</h4>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Chip
                  color="default"
                  size="sm"
                  variant="flat"
                  radius="sm"
                  classNames={{
                    content: "font-bold",
                  }}
                  startContent={
                    <CiLocationOn className="font-bold" size={16} />
                  }
                >
                  {address || <PulseLoader color="gray" size={4} />}
                </Chip>
              </div>
            </div>

            {/* <div className="col-span-12 flex items-center gap-2 mt-3 text-sm font-medium">
              <span className="text-sm font-medium text-[#1E293B]  ">
                Giá khám:
                <span className="rounded-xl ml-1 text-[#1D7ED8] font-bold">
                  {workRoomAndSchedule.checkUpPrice.toLocaleString()} vnđ
                </span>
              </span>
              <Divider orientation="vertical" className="h-3 mx-5" />
              <span className="rounded-xl text-[#1E293B]  text-sm font-medium">
                <span className="mr-2"> Sẳn lịch:</span>
                <ScheduleBox schedules={workRoomAndSchedule.schedules} />
              </span>
            </div>
            <div className="col-span-12 flex items-center gap-2 mt-3 text-sm font-medium">
              <span className="text-[30px] font-medium text-[#1E293B]  ">
                4.0
                <span className="rounded-xl ml-1 font-bold text-base">
                  <Rate
                    disabled
                    defaultValue={4}
                    className="text-[18px] ml-2"
                  />
                </span>
              </span>
            </div> */}
          </div>
          {/* <div className="">
            <ScheduleBox schedules={workRoomAndSchedule.schedules} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
