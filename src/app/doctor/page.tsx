"use client";

import { Image } from "@nextui-org/image";
import bg1 from "../../assets/images/doctor/bg-img-01.png";
import img1 from "../../assets/images/doctor/img1.png";
import { useAuth } from "@/hooks";
import { BsChatSquareTextFill } from "react-icons/bs";
import useSWR from "swr";
import { API_CHART } from "@/api-services/constant-api";
import { Statistic } from "antd";
import { StatisticProps } from "antd/lib";
import CountUp from "react-countup";
import { calculateUpDownPerson } from "@/untils/common";
import { FaBusinessTime } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import BookingDoctor from "@/components/chart/BookingDoctor";
import BookingDoctorGender from "@/components/chart/BookingDoctorGender";
import BookingDoctorChartLastBooking from "@/components/chart/BookingDoctorChartLastBooking";

export default function DoctorOverview() {
  const { profile } = useAuth();
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," />
  );
  const { data: resChartIndex1 } = useSWR<{
    booking: {
      bookingCountSuccess: number;
      bookingCountLastMonth: number;
      bookingCountSum: number;
    };
    patient: {
      patientCountHere: number;
      patientCountLast: number;
      patientCountSum: number;
    };
    chat: {
      chatCountHere: number;
      chatCountLast: number;
      chatCountSum: number;
    };
    schedule: {
      scheduleCountHere: number;
      scheduleCountLast: number;
      scheduleCountSum: number;
    };
  }>(`${API_CHART}?role=doctor&page=home&index=1&staffId=` + profile?.id || "");

  return (
    <div className="grid grid-cols-12 gap-6 mb-12">
      <div className="relative col-span-12">
        <div
          style={{
            position: "absolute",
            backgroundImage: `url(${bg1.src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "top right",
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
        <div className="box-white ">
          <div className="flex items-center flex-wrap py-6">
            <div className="w-1/2 text-left">
              <h2 className="text-[26px] font-semibold mb-1">
                Good Morning,{" "}
                <span className="text-[#2E37A4] ">{profile?.fullName}</span>
              </h2>
              <span className="text-base text-gray-500">
                Have a nice day at work
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 box-white grid grid-cols-4 gap-4">
        <div className="flex items-center gap-4 ">
          <div className="w-[66px] h-[66px] flex-shrink-0 rounded-xl bg-[#2E37A4] flex items-center justify-center">
            <Image
              className="w-8 h-8"
              width={32}
              height={32}
              src="https://preclinic.dreamstechnologies.com/html/template/assets/img/icons/doctor-dash-01.svg"
            ></Image>
          </div>
          <div className="flex-1 relative">
            <div className="absolute h-[44px] w-[2px] right-0 bg-[#2e37a433] top-1/2 -translate-y-1/2"></div>
            <div className="flex items-center gap-1 font-medium mb-2">
              <span className="font-medium text-2xl text-[#2E37A4]">
                <Statistic
                  value={resChartIndex1?.booking.bookingCountSuccess}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#2E37A4",
                  }}
                  rootClassName="text-2xl text-[#2E37A4] "
                />
              </span>
              <span className="text-[#33344833] text-sm flex items-center">
                /
                <Statistic
                  value={resChartIndex1?.booking.bookingCountSum}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    color: "#33344833",
                  }}
                  rootClassName="text-sm text-[#33344833] "
                />
              </span>

              <span className="flex-1 text-center ">
                {calculateUpDownPerson(
                  resChartIndex1?.booking.bookingCountLastMonth,
                  resChartIndex1?.booking.bookingCountSuccess
                )?.isUp ? (
                  <span className="text-[#00D3C7] text-sm rounded-lg bg-[#00d3c71a] py-1 px-2">
                    +
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.booking.bookingCountLastMonth,
                        resChartIndex1?.booking.bookingCountSuccess
                      )?.person
                    }
                    %
                  </span>
                ) : (
                  <span className="text-[#ff01a2] text-sm rounded-lg bg-[#ffe5f6] py-1 px-2">
                    -
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.booking.bookingCountLastMonth,
                        resChartIndex1?.booking.bookingCountSuccess
                      )?.person
                    }
                    %
                  </span>
                )}
              </span>
            </div>
            <div className="font-medium text-left">Cuộc hẹn</div>
          </div>
        </div>

        <div className="flex items-center gap-8 ">
          <div className="w-[66px] h-[66px] flex-shrink-0 rounded-xl bg-[#2E37A4] flex items-center justify-center">
            <Image
              className="w-8 h-8"
              width={32}
              height={32}
              src="https://preclinic.dreamstechnologies.com/html/template/assets/img/icons/doctor-dash-02.svg"
            ></Image>
          </div>
          <div className="flex-1 relative">
            <div className="absolute h-[44px] w-[2px] right-0 bg-[#2e37a433] top-1/2 -translate-y-1/2"></div>
            <div className="flex items-center gap-1 font-medium mb-2">
              <span className="font-medium text-2xl text-[#2E37A4]">
                <Statistic
                  value={resChartIndex1?.patient.patientCountHere}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    fontWeight: 700,
                    color: "#2E37A4",
                  }}
                  rootClassName="text-2xl text-[#2E37A4] "
                />
              </span>
              <span className="text-[#33344833] text-sm flex items-center">
                /
                <Statistic
                  value={resChartIndex1?.patient.patientCountSum}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    fontWeight: 700,
                    color: "#33344833",
                  }}
                  rootClassName="text-sm text-[#33344833] "
                />
              </span>

              <span className="flex-1 text-center ">
                {calculateUpDownPerson(
                  resChartIndex1?.patient.patientCountLast,
                  resChartIndex1?.patient.patientCountHere
                )?.isUp ? (
                  <span className="text-[#00D3C7] text-sm rounded-lg bg-[#00d3c71a] py-1 px-2">
                    +
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.patient.patientCountLast,
                        resChartIndex1?.patient.patientCountHere
                      )?.person
                    }
                    %
                  </span>
                ) : (
                  <span className="text-[#ff01a2] text-sm rounded-lg bg-[#ffe5f6] py-1 px-2">
                    -
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.patient.patientCountLast,
                        resChartIndex1?.patient.patientCountHere
                      )?.person
                    }
                    %
                  </span>
                )}
              </span>
            </div>
            <div className="font-medium text-left">Bệnh nhân</div>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <div className="w-[66px] h-[66px] flex-shrink-0 rounded-xl bg-[#2E37A4] flex items-center justify-center">
            <Image
              className="w-8 h-8"
              width={32}
              height={32}
              src="https://preclinic.dreamstechnologies.com/html/template/assets/img/icons/doctor-dash-03.svg"
            ></Image>
          </div>
          <div className="flex-1 relative">
            <div className="absolute h-[44px] w-[2px] right-0 bg-[#2e37a433] top-1/2 -translate-y-1/2"></div>
            <div className="flex items-center gap-1 font-medium mb-2">
              <span className="font-medium text-2xl text-[#2E37A4]">
                <Statistic
                  value={resChartIndex1?.chat.chatCountHere}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    fontWeight: 700,
                    color: "#2E37A4",
                  }}
                  rootClassName="text-2xl text-[#2E37A4] "
                />
              </span>
              <span className="text-[#33344833] text-sm flex items-center">
                /
                <Statistic
                  value={resChartIndex1?.chat.chatCountSum}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    color: "#33344833",
                  }}
                  rootClassName="text-sm text-[#33344833] "
                />
              </span>
              <span className="flex-1 text-center ">
                {calculateUpDownPerson(
                  resChartIndex1?.chat.chatCountLast,
                  resChartIndex1?.chat.chatCountHere
                )?.isUp ? (
                  <span className="text-[#00D3C7] text-sm rounded-lg bg-[#00d3c71a] py-1 px-2">
                    +
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.chat.chatCountLast,
                        resChartIndex1?.chat.chatCountHere
                      )?.person
                    }
                    %
                  </span>
                ) : (
                  <span className="text-[#ff01a2] text-sm rounded-lg bg-[#ffe5f6] py-1 px-2">
                    -
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.chat.chatCountLast,
                        resChartIndex1?.chat.chatCountHere
                      )?.person
                    }
                    %
                  </span>
                )}
              </span>
            </div>
            <div className="font-medium text-left">Liên hệ</div>
          </div>
        </div>
        <div className="flex items-center gap-4 ">
          <div className="w-[66px] h-[66px] flex-shrink-0 rounded-xl bg-[#2E37A4] flex items-center justify-center">
            {/* <Image
              className="w-8 h-8"
              width={32}
              height={32}
              src="https://preclinic.dreamstechnologies.com/html/template/assets/img/icons/doctor-dash-04.svg"
            ></Image> */}
            <IoMdTime color="#fff" className="w-8 h-8" />
          </div>
          <div className="flex-1 relative">
            <div className="flex items-center gap-1 font-medium mb-2">
              <span className="font-medium text-2xl text-[#2E37A4]">
                {" "}
                <Statistic
                  value={resChartIndex1?.schedule.scheduleCountHere}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#2E37A4",
                  }}
                  rootClassName="text-2xl text-[#2E37A4] "
                />
              </span>
              <span className="text-[#33344833] text-sm flex items-center">
                /
                <Statistic
                  value={resChartIndex1?.schedule.scheduleCountSum}
                  formatter={formatter}
                  className=""
                  valueStyle={{
                    color: "#33344833",
                  }}
                  rootClassName="text-sm text-[#33344833] "
                />
              </span>

              <span className="flex-1 text-center ">
                {calculateUpDownPerson(
                  resChartIndex1?.schedule.scheduleCountLast,
                  resChartIndex1?.schedule.scheduleCountHere
                )?.isUp ? (
                  <span className="text-[#00D3C7] text-sm rounded-lg bg-[#00d3c71a] py-1 px-2">
                    +
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.schedule.scheduleCountLast,
                        resChartIndex1?.schedule.scheduleCountHere
                      )?.person
                    }
                    %
                  </span>
                ) : (
                  <span className="text-[#ff01a2] text-sm rounded-lg bg-[#ffe5f6] py-1 px-2">
                    -
                    {
                      calculateUpDownPerson(
                        resChartIndex1?.schedule.scheduleCountLast,
                        resChartIndex1?.schedule.scheduleCountHere
                      )?.person
                    }
                    %
                  </span>
                )}
              </span>
            </div>
            <div className="font-medium text-left">Khung giờ</div>
          </div>
        </div>
      </div>

      <div className="col-span-8 ">
        <BookingDoctor />
      </div>

      <div className="col-span-4 ">
        <BookingDoctorGender />
      </div>

      <BookingDoctorChartLastBooking />
    </div>
  );
}
