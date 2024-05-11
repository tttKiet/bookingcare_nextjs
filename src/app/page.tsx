"use client";

import TreeWater from "@/components/svgs/TreeWater";
import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import { CiPlay1 } from "react-icons/ci";
import ListDoctorImg from "../assets/images/home/list_doctor.png";
import sheDoctorImg from "../assets/images/home/she_doctor.png";
import Rule1 from "../components/svgs/home/Rule1";
import Rule2 from "../components/svgs/home/Rule2";
import Svg1 from "../components/svgs/SvgHome1";
import Svg2 from "../components/svgs/SvgHome2";
import Svg3 from "../components/svgs/SvgHome3";
import SvgHomeHealth from "../components/svgs/SvgHomeHealth";
import { Statistic } from "antd";
import { StatisticProps } from "antd/lib";
import CountUp from "react-countup";
import HomeService from "@/components/user/HomeService";
import HomeAbout1 from "@/components/user/HomeAbout1";
import HomeWhy from "@/components/user/HomeWhy";
import useSWR from "swr";
import { API_ACCOUNT_STAFF, API_INDEX } from "@/api-services/constant-api";
import { ResData } from "@/types";
import Link from "next/link";
import HomeReview from "@/components/user/HomeReview";
export default function Home() {
  const formatter: StatisticProps["formatter"] = (value) => (
    <CountUp end={value as number} separator="," delay={3} duration={8} />
  );

  const { data: index1 } = useSWR<{
    patientCount: number;
    reviewCount: number;
    doctorCount: number;
  }>(`${API_INDEX}?page=home&index=1`);

  const { data: index2 } = useSWR<{
    reviewCount: number;
    reviewAvg: number;
  }>(`${API_INDEX}?page=home&index=2`);
  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto max-h-screen overflow-hidden">
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <div className="mt-20">
                <div className="text-[#1b3c74] text-6xl font-bold relative  pt-11 pr-11">
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                  >
                    Con đường đáng tin cậy để phục hồi sức khỏe của bạn
                  </motion.div>
                  <div className="absolute right-0 top-0">
                    <motion.div
                      animate={{
                        scale: [0.8, 1, 1.2, 1.1, 1.3, 1.4, 1.1, 0.9],
                        rotate: [2, 0, 10, 7, 2],
                        transition: { repeat: Infinity, duration: 3 },
                      }}
                    >
                      <TreeWater />
                    </motion.div>
                  </div>
                </div>
                <motion.p
                  className="my-11 text-md max-w-sm"
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                >
                  Tại các bệnh viện ở đây, chúng tôi tin rằng việc chăm sóc sức
                  khỏe không chỉ là một dịch vụ. Đó motion.phải là một hành
                  trình nhân ái và hợp tác hướng tới sức khỏe.
                </motion.p>
                <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                  >
                    <Link href={"/health-facility"}>
                      <Button color="primary" size="lg">
                        Đặt lịch ngay
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 100,
                    }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 cursor-pointer hover:opacity-90"
                  >
                    <div className="loader mx-8 mr-5">
                      <span className="p-2 rounded-full z-10 bg-yellow-500 flex items-center justify-center">
                        <CiPlay1 color="white" size={20} />
                      </span>
                    </div>
                    <span className="text-[#1b3c74] text-base font-medium">
                      Xem video
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                  viewport={{ once: true }}
                  className="mb-[-75px] ml-[116px] max-w-[100%] mr-[58px] mt-20 "
                >
                  <Image
                    src={sheDoctorImg.src}
                    width={500}
                    height={800}
                    className="w-full"
                    alt="She"
                  ></Image>
                </motion.div>
                <div className="absolute bottom-36 ">
                  <motion.div
                    animate={{
                      x: [0.4, 1, 1.1, 0.4, 0.3, 0.5, 0.6, 0.7, 0.4],
                      scale: [0.8, 1, 1.1, 1.1, 0.9, 1.2, 1.1, 0.9, 0.8],
                      rotate: [2, 0, 10, 7, 2],
                      // transform:
                      transition: {
                        repeat: Infinity,
                        duration: 8,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    <Svg1 />
                  </motion.div>
                </div>
                <div className="absolute top-12 right-0 ">
                  <motion.div
                    animate={{
                      x: [0.4, 1, 1.1, 0.4, 0.3, 0.5, 0.6, 0.7, 0.4],
                      scale: [0.8, 1, 1.1, 1.1, 0.9, 1.2, 1.1, 0.9, 0.8],
                      rotate: [2, 0, 10, 7, 2],
                      // transform:
                      transition: {
                        repeat: Infinity,
                        duration: 8,

                        repeatType: "reverse",
                      },
                    }}
                  >
                    <Svg2 />
                  </motion.div>
                </div>
                <div className="absolute bottom-[220px] right-[-63px] ">
                  <motion.div
                    animate={{
                      x: [0.4, 1, 1.1, 0.4, 0.3, 0.5, 0.6, 0.7, 0.4],
                      scale: [0.8, 1, 1.1, 1.1, 0.9, 1.2, 1.1, 0.9, 0.8],
                      rotate: [2, 0, 10, 7, 2],
                      // transform:
                      transition: {
                        repeat: Infinity,
                        duration: 8,

                        repeatType: "reverse",
                      },
                    }}
                  >
                    <Svg3 />
                  </motion.div>
                </div>

                <div className="absolute top-[220px] right-0">
                  <motion.div
                    animate={{
                      scale: [0.6, 0.8, 0.8, 0.5, 0.9, 0.7, 0.6],
                      rotate: [2, 0, 1, 2, 2],
                      // transform:
                      transition: {
                        repeat: Infinity,
                        duration: 8,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    <SvgHomeHealth />
                  </motion.div>
                </div>

                <div className="absolute bottom-[145px] right-[-9px] z-20">
                  <motion.div
                    animate={{
                      scale: [0.8, 0.8, 0.7, 0.7, 0.8, 0.7, 0.7],
                      rotate: [2, 0, 1, 2, 2],
                      y: [100, 60, 30],
                      // transform:
                      transition: {
                        repeat: Infinity,
                        duration: 8,
                        repeatType: "reverse",
                      },
                    }}
                  >
                    <div className="p-4 w-[220px] h-[170px]  bg-white rounded-md shadow">
                      <h3 className="text-[#1b3c74] font-medium text-base">
                        Gặp gở các Bác sĩ
                      </h3>
                      <Image
                        src={ListDoctorImg.src}
                        height={40}
                        width={220}
                        alt="List Doctor"
                        className="w-full my-3"
                      ></Image>
                      <div
                        style={{
                          backgroundColor: "rgba(77,180,223,.3)",
                          borderRadius: "6px",
                          width: "192px",
                          height: "10px",
                          marginBottom: "13px",
                        }}
                      ></div>
                      <div
                        style={{
                          backgroundColor: "rgba(77,180,223,.15)",
                          borderRadius: "6px",
                          width: "162px",
                          height: "10px",
                          marginBottom: "13px",
                        }}
                      ></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fun-fact-section relative overflow-hidden">
        <div className="container mx-auto">
          <div className="absolute top-0 left-0 bottom-0">
            <Rule1 />
          </div>
          <div className="absolute top-0 right-0 bottom-0">
            <Rule2 />
          </div>
          <div className="grid grid-cols-2">
            <div className="col-span-1">
              <motion.h2
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-white font-medium text-6xl"
              >
                "Giao hàng <br></br>Sức khỏe bằng trái tim"
              </motion.h2>
            </div>
            <div className="flex items-center gap-14 text-white col-span-1 justify-center">
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
              >
                <Statistic
                  title={
                    <div className="font-medium text-white text-base mb-3">
                      Bệnh nhân
                    </div>
                  }
                  value={index1?.patientCount}
                  valueStyle={{
                    fontSize: 40,
                    color: "#fff",
                    fontWeight: 600,
                  }}
                  rootClassName="text-4xl text-white"
                  precision={2}
                  formatter={formatter}
                  suffix="+"
                  // prefix={<LikeOutlined />}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
              >
                <Statistic
                  title={
                    <div className="font-medium text-white text-base mb-3">
                      Độ hài lòng
                    </div>
                  }
                  value={index1?.reviewCount}
                  suffix="%"
                  valueStyle={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                  rootClassName="text-4xl text-white"
                  precision={2}
                  formatter={formatter}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
              >
                <Statistic
                  title={
                    <div className="font-medium text-white text-base mb-3">
                      Bác sĩ
                    </div>
                  }
                  value={index1?.doctorCount}
                  valueStyle={{
                    fontSize: 30,
                    fontWeight: 600,
                    color: "#fff",
                  }}
                  suffix="+"
                  rootClassName="text-4xl text-white"
                  precision={2}
                  formatter={formatter}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <HomeService />
      </div>

      <div className="container mx-auto my-[140px]">
        <HomeAbout1 />
      </div>

      <div className="container mx-auto">
        <HomeReview />
      </div>

      <div className="container mx-auto mb-[140px]">
        <HomeWhy />
      </div>
    </>
  );
}
