"use client";

import Image from "next/image";
import imgDocter from "../assets/images/home-layer1.png";
import profit1Img from "../assets/images/profit1.png";
import profit2Img from "../assets/images/profit2.png";
import profit3Img from "../assets/images/profit3.png";
import { ProfitUseBooking } from "@/components/profit";
import { ServiceCard } from "@/components/common";

export default function Home() {
  return (
    <>
      <main className="">
        <div className="bg-home min-h-[calc(100vh-128px)] bg-no-repeat bg-cover relative">
          <div className="bg-gradient-to-b from-black/5 to-black/10 absolute inset-0 z-0">
            {/* filter bg */}
          </div>
          <section className="flex overflow-hidden relative items-start     py-4">
            <div className="container my-0 mx-auto relative z-10 pt-16">
              <h3 className="mb-4 text-base font-semibold inline-block text-white py-2 px-4  rounded-lg bg-gradient-blue-to-transparent">
                Booking Care
              </h3>
              <h3 className="mb-2 text-3xl  font-extrabold text-blue-500">
                Kết nối người dân với
              </h3>
              <h3 className="mb-3 text-3xl  font-extrabold text-blue-500">
                Cơ sở - Dịch vụ Y tế
              </h3>
              <h4 className="mb-3 text-base font-light text-blue-700">
                Dịch vụ sức khỏe tốt nhất
              </h4>
              <p className="mb-3 text-base text-gray-700  ">
                3/2 CTU, Booking care best chosse
              </p>
            </div>
          </section>
          <div className=" absolute bottom-0 right-0 xl:right-[10%] xl:w-[520px] w-[100%] md:w-[calc(620px)] sm:w-[420px]">
            <Image alt="Docter" src={imgDocter} />
          </div>
        </div>

        <section className=" relative">
          <div className="sm:absolute sm:top-0 z-20 sm:translate-y-[-50%] w-full static">
            <div className="container mx-auto py-4">
              <div className="grid sm:grid-cols-3 sm:gap-1 gap-4 grid-cols-1 ">
                <ProfitUseBooking
                  src={profit1Img}
                  title="Đội ngủ nhân viên chuyên nghiệp"
                  description="Aenean massa cum sociis natoque penatibus et magnis dis partu rient to montes"
                />
                <ProfitUseBooking
                  src={profit2Img}
                  title="Cung cấp nhiều dịch vụ"
                  description="Aenean massa cum sociis natoque penatibus et magnis dis partu rient to montes,partu rient to montes"
                />
                <ProfitUseBooking
                  src={profit3Img}
                  title="Gọi tư vấn miễn phí"
                  description="Aenean massa cum sociis magnis dis partu rient to montes"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center mt-2 md:mt-44">
          <div className="container">
            <div className="border border-spacing-0 rounded-md bg-white p-3 px-6 shadow-md ">
              <div className="gap-1 items-center grid grid-cols-12">
                <div className="col-span-6">
                  <h4 className="font-normal text-xl text-blue-400 tracking-wide">
                    BOOKING CARE
                  </h4>
                  <p className="text-sm font-normal text-gray-800 ">
                    Đặt lịch khám bệnh
                  </p>
                </div>
                <p className="col-span-6 text-sm px-2">
                  <span className="font-normal text-sm text-blue-400 tracking-wide mr-1">
                    BOOKING CARE
                  </span>
                  cung cấp dịch vụ đặt khám nhanh, lấy số thứ tự trực tuyến và
                  tư vấn sức khỏe từ xa tại các Cơ sở Y tế hàng đầu Việt Nam như
                  Bệnh viện Đại học Y Dược TP.HCM, Bệnh viện Chợ Rẫy và Bệnh
                  viện Nhi Đồng...
                </p>
              </div>

              <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
                <ServiceCard
                  description="Đặt khám nhanh, thanh toán và lấy số thứ tự trực tuyến tiết
                      kiệm thời gian công sức"
                  title="Đặt khám nhanh"
                  linkto="#"
                  src="https://res.cloudinary.com/djvlxywoe/image/upload/v1692149199/motel_posts/xlire5kduge7x2kdvvmt.jpg"
                />
                <ServiceCard
                  description="Mạng lưới bệnh viện, phòng khám, phòng mạch phủ khắp toàn quốc"
                  title="Cơ sở y tế rộng khắp"
                  linkto="#"
                  src="https://res.cloudinary.com/djvlxywoe/image/upload/v1692149136/motel_posts/wuvagsrfmt9ezrbvvhxl.jpg"
                />
                <ServiceCard
                  description="Đặt lịch dể dàng"
                  title="Đặt lịch dể dàng"
                  linkto="#"
                  src="https://res.cloudinary.com/djvlxywoe/image/upload/v1692149199/motel_posts/xlire5kduge7x2kdvvmt.jpg"
                />
              </div>
            </div>
          </div>
        </section>
        <div className="h-screen"></div>
      </main>
    </>
  );
}
