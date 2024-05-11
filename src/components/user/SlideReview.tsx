import { CiSquarePlus } from "react-icons/ci";
import IconBgGray from "../common/IconBgGray";
import { ExaminationService, Review } from "@/models";
import { Avatar } from "@nextui-org/react";
import male from "../../assets/images/doctor/male_doctor.png";
import female from "../../assets/images/doctor/female_doctor.png";

export interface ISlideServiceProps {
  s: Review;
}

export default function SlideReview({ s }: ISlideServiceProps) {
  return (
    <div className="pt-10">
      <div
        className="p-5 pb-6 border rounded-2xl  bg-white  hover:shadow-md hover:border-blue-500 
      border-gray-500 max-w-[300px] h-[300px] relative overflow-visible"
      >
        <div className="absolute top-0 left-0 translate-x-1/2 -translate-y-1/2 z-20">
          <div
            style={{
              boxShadow: "0 24px 40px rgba(0,0,0,.05)",
            }}
            className="rounded-full bg-white flex items-center justify-center w-10 h-10"
          >
            <Avatar
              isBordered
              src={s.Staff.gender == "male" ? male.src : female.src}
            />
          </div>
        </div>
        <div className="mt-2 ">
          <h4 className="font-bold text-[#1b3c74] text-xl line-clamp-2 min-h-[64px]">
            Bác sĩ: {s.Staff.fullName}
          </h4>
          <h4 className="font-bold text-gray-500 text-base ">Người dùng</h4>
          <p className="text-lg text-[rgb(60,66,83)] mt-2 mb-6 line-clamp-3">
            "{s.description}"
          </p>
        </div>
      </div>
    </div>
  );
}
