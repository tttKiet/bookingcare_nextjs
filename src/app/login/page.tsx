import Image from "next/image";
import logi from "../../assets/images/logi_y_te.png";
import doctor from "../../assets/images/login_register/doctor.png";
import bg2 from "../../assets/images/login_register/bg2.png";
import Svg1 from "../../components/svgs/Svg1";
import BodyLogin from "@/components/body-modal/BodyLogin";
export interface ILoginPageProps {}

export default function LoginPage(props: ILoginPageProps) {
  return (
    <div className="flex min-h-screen">
      {/* auth left */}
      <div className="p-11 w-2/5 border bg-[#f5f9fe] relative overflow-hidden">
        <div className="flex items-center gap-1 justify-center">
          <Image src={logi.src} width={40} height={40} alt="Logo"></Image>
          <span>BOOKING CARE</span>
        </div>
        <div className="text-center mt-9 flex flex-col justify-center items-center">
          <h2
            className="text-[#1e5dbc] font-extrabold text-5xl my-3 max-w-[240px]"
            style={{
              lineHeight: "120%",
            }}
          >
            The Next Generation
          </h2>
          <h2 className="text-[#4eb2f9] font-bold my-3 text-4xl">
            Of Clinic & Family Care
          </h2>
          <p className="text-xl my-3 text-[#536288]">
            Our clinic lets you visit exceptional medical providers, get
            clinically-backed wellness services, and discover the right
            medicine, all in one place.
          </p>
          <div>
            <Image
              className="ml-16"
              src={doctor.src}
              width={350}
              height={500}
              alt="Doctor"
            ></Image>
          </div>
        </div>
        <div
          style={{
            zIndex: 1,
            width: "auto",
            height: "50vh",
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            objectFit: "cover",
            backgroundPosition: "50% 77%",
          }}
        >
          <Image
            className="ml-16"
            src={bg2.src}
            width={350}
            height={500}
            alt="Doctor"
          ></Image>
        </div>
      </div>

      <div className="border text-center w-3/5 pt-24 px-40 pb-10">
        <BodyLogin />
      </div>
    </div>
  );
}
