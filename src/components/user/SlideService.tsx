import { CiSquarePlus } from "react-icons/ci";
import IconBgGray from "../common/IconBgGray";

export interface ISlideServiceProps {}

export default function SlideService(props: ISlideServiceProps) {
  return (
    <div className="p-5 pb-6 border rounded-2xl  bg-[rgb(245,251,255)] border-[rgb(245,251,255)] max-w-[300px] h-[300px]">
      <div>
        <div
          style={{
            boxShadow: "0 24px 40px rgba(0,0,0,.05)",
          }}
          className="rounded-full bg-white flex items-center justify-center w-16 h-16"
        >
          <CiSquarePlus size={28} color="blue" />
        </div>
      </div>
      <div className="mt-8 ">
        <h4 className="font-bold text-[#1b3c74] text-2xl">Cardiology</h4>
        <p className="text-lg text-[rgb(60,66,83)] mt-4 mb-6">
          Conducting tests to assess heart structure and function.
        </p>
      </div>
    </div>
  );
}
