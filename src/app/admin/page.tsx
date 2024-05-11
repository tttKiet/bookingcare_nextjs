"use client";

import { TotalDashBoardHealthFacilitiesAdmin } from "@/components/common";
import { Image } from "@nextui-org/image";
import bg1 from "../../assets/images/doctor/bg-img-01.png";
import img1 from "../../assets/images/doctor/img1.png";
import patientAvt from "../../assets/images/patient/profile-patient.svg";
import useSWR from "swr";
import { API_ACCOUNT_STAFF, API_CHART } from "@/api-services/constant-api";
import { ChartPageHomeIndex1, Staff } from "@/models";
import { HiOutlineCalendar } from "react-icons/hi";
import { HiArrowTrendingDown, HiArrowTrendingUp } from "react-icons/hi2";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { calculateUpDownPerson } from "@/untils/common";
import CountUp from "react-countup";
import { Statistic, StatisticProps } from "antd";
import BookinGender from "@/components/chart/BookingGender";
import { Select } from "@nextui-org/react";
import SpecialistPercent from "@/components/chart/SpecialistPercent";
import SpecialistPercentList from "@/components/chart/SpecialistPercentList";
import { ManagerPatientAdmin } from "@/components/admin-box/ManagerPatientAdmin";
import { ManagerPatientAdminDashBoard } from "@/components/admin-box/ManagerPatientAdminDashBoard";

const formatter: StatisticProps["formatter"] = (value) => (
  <CountUp end={value as number} separator="," />
);

export default function Admin() {
  const { data: resChartIndex1 } = useSWR<ChartPageHomeIndex1>(
    `${API_CHART}?role=admin&page=home&index=1`
  );

  return (
    <div className="relative mb-20">
      <div className="box-white relative">
        <div className="flex items-center flex-wrap py-6">
          <div className="w-1/2 text-left">
            <h2 className="text-[26px] font-semibold mb-1">
              Good Morning, <span className="text-[#2E37A4] ">Admin</span>
            </h2>
            <span className="text-base text-gray-500">
              Have a nice day at work
            </span>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            backgroundImage: `url(${bg1.src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top right",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: "[-1]",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 0,
            zIndex: "[-1]",
          }}
        >
          <Image src={img1.src} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-6 relative z-20">
        <div className="box-white text-left">
          <h4 className="mb-[10px]">
            <span
              className="flex items-center justify-center w-[50px] h-[50px] rounded-xl 
               border-[2px] bg-[#2e37a40d]
             border-[#2e37a41a] "
            >
              <HiOutlineCalendar size={25} color="#484c9c" />
            </span>
          </h4>
          <h4 className="text-[#2b2f32] text-base font-bold text-left">
            Lịch hẹn
          </h4>

          <div className="text-[#2E37A4] text-[32px] my-1 font-bold">
            <Statistic
              value={resChartIndex1?.booking.month}
              formatter={formatter}
              className=""
              valueStyle={{
                fontSize: 32,
                fontWeight: 700,
                color: "#2E37A4",
              }}
              rootClassName="text-[#2E37A4] text-[32px] "
            />
          </div>
          <div className="font-medium text-sm flex items-center">
            {calculateUpDownPerson(
              resChartIndex1?.booking.lastMonth,
              resChartIndex1?.booking.month
            )?.isUp ? (
              <span className="text-[#00D3C7] flex items-center ">
                <HiArrowTrendingUp size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.booking.lastMonth,
                      resChartIndex1?.booking.month
                    )?.person
                  }
                  %
                </span>
              </span>
            ) : (
              <span className="text-[#FF3667] flex items-center ">
                <HiArrowTrendingDown size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.booking.lastMonth,
                      resChartIndex1?.booking.month
                    )?.person
                  }
                  %
                </span>
              </span>
            )}

            <span className="text-[#33344880] ml-1"> so với tháng trước</span>
          </div>
        </div>
        <div className="box-white text-left">
          <h4 className="mb-[10px]">
            <span
              className="flex items-center justify-center w-[50px] h-[50px] rounded-xl 
               border-[2px] bg-[#2e37a40d]
             border-[#2e37a41a] "
            >
              {/* <HiOutlineCalendar size={25} color="#484c9c" /> */}
              <Image
                src={patientAvt.src}
                width={30}
                height={30}
                className="w-[30px] h-[30px] text-[#484c9c]"
              ></Image>
            </span>
          </h4>
          <h4 className="text-[#2b2f32] text-base font-bold text-left">
            Bệnh nhân
          </h4>

          <div className="text-[#2E37A4] text-[32px] my-1 font-bold">
            <Statistic
              value={resChartIndex1?.patient.month}
              formatter={formatter}
              className=""
              valueStyle={{
                fontSize: 32,
                fontWeight: 700,
                color: "#2E37A4",
              }}
              rootClassName="text-[#2E37A4] text-[32px] "
            />
          </div>
          <div className="font-medium text-sm flex items-center">
            {calculateUpDownPerson(
              resChartIndex1?.patient.lastMonth,
              resChartIndex1?.patient.month
            )?.isUp ? (
              <span className="text-[#00D3C7] flex items-center ">
                <HiArrowTrendingUp size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.patient.lastMonth,
                      resChartIndex1?.patient.month
                    )?.person
                  }
                  %
                </span>
              </span>
            ) : (
              <span className="text-[#FF3667] flex items-center ">
                <HiArrowTrendingDown size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.patient.lastMonth,
                      resChartIndex1?.patient.month
                    )?.person
                  }
                  %
                </span>
              </span>
            )}
            <span className="text-[#33344880] ml-1"> so với tháng trước</span>
          </div>
        </div>
        <div className="box-white text-left">
          <h4 className="mb-[10px]">
            <span
              className="flex items-center justify-center w-[50px] h-[50px] rounded-xl 
               border-[2px] bg-[#2e37a40d]
             border-[#2e37a41a] "
            >
              <HiOutlineCalendar size={25} color="#484c9c" />
            </span>
          </h4>
          <h4 className="text-[#2b2f32] text-base font-bold text-left">
            Lịch hẹn thành công
          </h4>

          <div className="text-[#2E37A4] text-[32px] my-1 font-bold">
            <Statistic
              value={resChartIndex1?.bookingSuccess.month}
              formatter={formatter}
              className=""
              valueStyle={{
                fontSize: 32,
                fontWeight: 700,
                color: "#2E37A4",
              }}
              rootClassName="text-[#2E37A4] text-[32px] "
            />
          </div>
          <div className="font-medium text-sm flex items-center">
            {calculateUpDownPerson(
              resChartIndex1?.bookingSuccess.lastMonth,
              resChartIndex1?.bookingSuccess.month
            )?.isUp ? (
              <span className="text-[#00D3C7] flex items-center ">
                <HiArrowTrendingUp size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.bookingSuccess.lastMonth,
                      resChartIndex1?.bookingSuccess.month
                    )?.person
                  }
                  %
                </span>
              </span>
            ) : (
              <span className="text-[#FF3667] flex items-center ">
                <HiArrowTrendingDown size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.bookingSuccess.lastMonth,
                      resChartIndex1?.bookingSuccess.month
                    )?.person
                  }
                  %
                </span>
              </span>
            )}
            <span className="text-[#33344880] ml-1"> so với tháng trước</span>
          </div>
        </div>
        <div className="box-white text-left">
          <h4 className="mb-[10px]">
            <span
              className="flex items-center justify-center w-[50px] h-[50px] rounded-xl 
               border-[2px] bg-[#2e37a40d]
             border-[#2e37a41a] "
            >
              <PiCurrencyCircleDollarBold size={25} color="#484c9c" />
            </span>
          </h4>
          <h4 className="text-[#2b2f32] text-base font-bold text-left">
            Doanh thu
          </h4>

          <div
            className="text-[#2E37A4] text-[32px] my-1 
          font-bold "
          >
            <Statistic
              value={resChartIndex1?.revenue.month}
              formatter={formatter}
              className=""
              valueStyle={{
                fontSize: 32,
                fontWeight: 700,
                color: "#2E37A4",
              }}
              suffix="vnđ"
              rootClassName="text-[#2E37A4] text-[32px] "
            />
          </div>
          <div className="font-medium text-sm flex items-center">
            {calculateUpDownPerson(
              resChartIndex1?.revenue.lastMonth,
              resChartIndex1?.revenue.month
            )?.isUp ? (
              <span className="text-[#00D3C7] flex items-center ">
                <HiArrowTrendingUp size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.revenue.lastMonth,
                      resChartIndex1?.revenue.month
                    )?.person
                  }
                  %
                </span>
              </span>
            ) : (
              <span className="text-[#FF3667] flex items-center ">
                <HiArrowTrendingDown size={20} />
                <span className="ml-1">
                  {
                    calculateUpDownPerson(
                      resChartIndex1?.revenue.lastMonth,
                      resChartIndex1?.revenue.month
                    )?.person
                  }
                  %
                </span>
              </span>
            )}

            <span className="text-[#33344880] ml-1"> so với tháng trước</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8">
          <BookinGender />
        </div>

        <div className="col-span-4">
          <SpecialistPercent />
        </div>

        <div className="col-span-3">
          <SpecialistPercentList />
        </div>

        <div className="col-span-9">
          <ManagerPatientAdminDashBoard />
        </div>
      </div>
    </div>
  );
}
