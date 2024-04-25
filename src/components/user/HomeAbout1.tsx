import Slider from "react-slick";
import SlideService from "./SlideService";
import { useRef } from "react";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Img1 from "../../assets/images/home/_about-image-one.jpg";
import Img2 from "../../assets/images/home/list_doctor_2.png";
import S5 from "../../components/svgs/SvgHome5";
import S6 from "../../components/svgs/SvgHome6";
import Star from "../../components/svgs/Star";
import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import { ImageAnimation } from "../img-animation/ImageAnimation";

export interface IHomeAbout1Props {}

export default function HomeAbout1(props: IHomeAbout1Props) {
  return (
    <div>
      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.25fr 1fr",
        }}
      >
        <div className="relative">
          <ImageAnimation
            src={Img1.src}
            width={724}
            height={657}
            alt="about"
          ></ImageAnimation>
          <div className="w-[261px] absolute top-[-50px] left-[-50px] z-10">
            <motion.div
              animate={{
                y: [20, 10, -20, 0, 14, -7],
                // scale: [0.8, 1, 1.1, 1.1, 0.9, 1.2, 1.1, 0.9, 0.8],
                rotate: [2, 0, 1, 0, 2],
                // transform:
                transition: {
                  repeat: Infinity,
                  duration: 8,
                  repeatType: "reverse",
                },
              }}
            >
              <div className="bg-white  p-4 rounded-lg  shadow-2xl  flex items-center gap-2 justify-center flex-col">
                <ImageAnimation
                  src={Img2.src}
                  width={186}
                  height={50}
                  alt="list"
                ></ImageAnimation>

                <div className="flex items-center gap-1 justify-center text-[#3c4253] text-lg">
                  <Star />
                  4.9 (5210 Đánh giá)
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="rounded-xl shadow bg-[#f5fbff] py-[50px] px-[60px] max-w-[700px] mt-[80px] ml-[-70px] relative z-10">
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="text-lg text-[#2490eb] font-medium"
            >
              Hơn 25 năm kinh nghiệm
            </motion.h3>
            <motion.h3
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="text-[#1b3c74] text-5xl font-bold mt-5"
            >
              Hành trình đến với sức khỏe tốt hơn của bạn bắt đầu từ đây
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="text-[#3c4253] text-lg mt-5"
            >
              Chúng tôi tận tâm cung cấp các dịch vụ chăm sóc sức khỏe chất
              lượng cao nhất cho cộng đồng của chúng tôi. Sứ mệnh của chúng tôi
              là thúc đẩy và nâng cao sức khỏe.
            </motion.p>
          </div>
          <div className="mr-[60px] my-9">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="flex items-start gap-3 mb-5"
            >
              <div className="w-12 h-12 rounded-full shadow flex-shrink-0 bg-white flex items-center justify-center">
                <S5 />
              </div>
              <div>
                <h3 className="text-[#1b3c74] text-2xl font-bold">
                  Nhiệm vụ của chúng ta
                </h3>
                <p className="text-[#3c4253] text-lg mt-3">
                  Sứ mệnh của chúng tôi là cung cấp các dịch vụ chăm sóc sức
                  khỏe nhân ái và chất lượng cao.
                </p>
              </div>
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
              className="flex items-start gap-3 mb-5"
            >
              <div className="w-12 h-12 rounded-full shadow flex-shrink-0 bg-white flex items-center justify-center">
                <S6 />
              </div>
              <div>
                <h3 className="text-[#1b3c74] text-2xl font-bold">
                  Tầm nhìn của chúng tôi
                </h3>
                <p className="text-[#3c4253] text-lg mt-3">
                  Tầm nhìn của chúng tôi là trở thành đối tác đáng tin cậy vì
                  sức khỏe và hạnh phúc của cộng đồng.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
