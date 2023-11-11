"use client";

import Image from "next/image";
import imgDocter from "../assets/images/home-layer1.png";
import img4 from "../assets/images/img4.jpg";
import profit2Img from "../assets/images/profit2.png";
import img10 from "../assets/images/img10.webp";
import img11 from "../assets/images/img11.webp";
import img12 from "../assets/images/img12.webp";
import img13 from "../assets/images/img13.webp";
import img14 from "../assets/images/img14.webp";
import img15 from "../assets/images/img15.webp";
import { CiDiscount1 } from "react-icons/ci";
import ListDoctorHomePage from "@/components/common/ListDoctorHomePage";
import { SlideHomePage } from "@/components/common/SlideHomepage";
import ListSpecialist from "@/components/common/ListSpecialist";
import HealthFacilitySlide from "@/components/common/HealthFacilitySlide";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Divider } from "antd";
import News from "@/components/common/News";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden mt-[-80px]">
      <svg
        viewBox="0 0 1024 1024"
        className="absolute right-0 top-0 z-10 h-[64rem] w-[64rem]  [mask-image:radial-gradient(closest-side,white,transparent)] translate-x-[50%] translate-y-[-50%]"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
            <stop stopColor="#000" />
            <stop offset={1} stopColor="blue" />
          </radialGradient>
        </defs>
      </svg>
      <main className="object-cover bg-no-repeat text-white relative bg-gradient-to-b from-[#a9ccff4d] to-[#d7eeff29]">
        <div className="">
          <div className="relative">
            <div className="z-20 absolute top-full min-w-full left-[50%] translate-x-[-50%] translate-y-[-20%]">
              <SlideHomePage />
            </div>
            {/* filter bg */}

            <div
              className="z-10 isolate min-h-screen overflow-hidden px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24  rounded-t-none md:rounded-t-none lg:rounded-t-none "
              style={{
                backgroundImage:
                  "linear-gradient( 270.3deg,  rgba(84,212,228,1) 0.2%, rgba(68,36,164,1) 100% )",
              }}
            >
              <div className="lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Lựa chọn tốt nhất của bạn.
                    <br />
                    Bắt đầu chăm sóc sức khỏe ngay hôm nay.
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    Booking - Care tổng hợp các tổ chức y tế hàng đầu cả nước
                    với các bác sỉ giàu kinh nghiệm
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                    <Link
                      href="#"
                      className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Đặt lịch ngay
                    </Link>
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-white"
                    >
                      Xem thêm <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
                <div className="relative mt-16 h-80 lg:mt-8">
                  <Image
                    className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
                    src={img4}
                    alt="App screenshot"
                    width={1824}
                    height={1080}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide */}
        <div className="z-0 relative mt-[400px]">
          {/* doctor */}
          <ListDoctorHomePage />
          <Divider className="my-10 mt-24" />
          <div className=" text-black container mx-auto">
            <ListSpecialist />
          </div>

          <Divider className="my-10 mt-24" />
          <div className="mt-10 text-black container mx-auto">
            <HealthFacilitySlide />
          </div>

          {/* Banner */}
          <div className="my-4">
            <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
              <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                  }}
                />
              </div>
              <div
                className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
              >
                <div
                  className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                  style={{
                    clipPath:
                      "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p className="text-sm leading-6 text-gray-900">
                  <strong className="font-semibold">Booking Care 2023</strong>
                  <svg
                    viewBox="0 0 2 2"
                    className="mx-2 inline h-0.5 w-0.5 fill-current"
                    aria-hidden="true"
                  >
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  Tham gia từ tháng 3 năm 2007 với nhiều ưu đãi cho khách hàng.
                </p>
                <Link
                  href="/health-facility"
                  className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Đặt lịch ngay <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
              <div className="flex flex-1 justify-end">
                <button
                  type="button"
                  className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
                >
                  <span className="sr-only">Dismiss</span>
                  <XMarkIcon
                    className="h-5 w-5 text-gray-900"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="my-10 mt-24" />

          <div className="bg-[#e8f2f7] shadow border-t-slate-100">
            <div className="container py-24 mx-auto">
              <div className="flex mx-auto w-full gap-7">
                <div className="w-[60%] flex justify-end ">
                  <Image src={img10} width={500} height={500} alt="Doctor" />
                </div>
                <div className="w-[40%] py-12">
                  <div className="max-w-[434px]">
                    <h4 className="text-4xl text-blue-600 font-semibold mb-4">
                      Đặt khám nhanh - Lấy số thứ tự trực tuyến
                    </h4>
                    <p className="text-base text-gray-500">
                      Bệnh nhân chủ động chọn thông tin đặt khám nhanh (ngày
                      khám, giờ khám và cơ sở y tế). Bệnh nhân sẽ nhận lấy số
                      thứ tự trực tuyến ngay trên phần mềm
                    </p>
                  </div>
                </div>
              </div>

              {/* news */}
              <div className=" text-black mt-20">
                <div>
                  <h4 className="text-4xl text-blue-600 font-semibold mb-4 mt-10 text-center w-[60%]">
                    Tin tức y tế
                  </h4>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-start-1 col-end-3 row-start-1 row-end-3">
                    <News
                      href="https://medpro.vn/tin-tuc/trung-tam-xet-nghiem-mic-giai-phap-cham-soc-suc-khoe-toan-dien"
                      img={img11}
                      time="09/11/2023, 02:36"
                      title="TRUNG TÂM XÉT NGHIỆM MIC - GIẢI PHÁP CHĂM SÓC SỨC KHỎE TOÀN DIỆN"
                      desc="Trung tâm xét nghiệm MIC chuyên cung cấp các dịch vụ xét nghiệm chất lượng, kết quả chính xác, thu hút sự tin tưởng đông đảo khách hàng trên địa bàn thành phố Hồ Chí Minh. Tìm hiểu ngay!"
                    />
                  </div>
                  <div className="">
                    <News
                      href="https://medpro.vn/tin-tuc/de-xuat-moi-kham-suc-khoe-tien-hon-nhan-bat-buoc-vi-loi-ich-the-he-sau"
                      img={img12}
                      title="ĐỀ XUẤT MỚI: KHÁM SỨC KHỎE TIỀN HÔN NHÂN BẮT BUỘC VÌ LỢI ÍCH THẾ HỆ SAU"
                      time="10/11/2023, 05:52"
                    />
                  </div>
                  <div className="">
                    <News
                      href="https://medpro.vn/tin-tuc/7-bac-si-tim-mach-gioi-tren-toan-quoc"
                      img={img13}
                      title="7 Bác Sĩ Tim Mạch Giỏi Trên Toàn Quốc"
                      time="05/11/2023, 09:06"
                    />
                  </div>
                  <div className="">
                    <News
                      href="https://medpro.vn/tin-tuc/cac-dau-hieu-suy-gian-tinh-mach-nguyen-nhan-va-dieu-tri"
                      img={img14}
                      title="Các Dấu Hiệu Suy Giãn Tĩnh Mạch: Nguyên Nhân và Điều Trị"
                      time="10/11/2023, 05:52"
                    />
                  </div>
                  <div className="">
                    <News
                      href="https://medpro.vn/tin-tuc/emotional-quotient-la-gi-co-the-cai-thien-duoc-khong"
                      img={img15}
                      title="Emotional Quotient là gì? Có thể cải thiện được không?"
                      time="10/11/2023, 05:52"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
