import Slider from "react-slick";
import SlideService from "./SlideService";
import { useRef } from "react";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Img1 from "../../assets/images/home/_about-image-one.jpg";
import Img2 from "../../assets/images/home/list_doctor_2.png";
import Img3 from "../../assets/images/home/why.jpg";
import S5 from "../svgs/SvgHome5";
import S6 from "../svgs/SvgHome6";
import Star from "../svgs/Star";
import { Image } from "@nextui-org/image";
import { motion } from "framer-motion";
import {
  TbSquareRoundedNumber1,
  TbSquareRoundedNumber2,
  TbSquareRoundedNumber3,
} from "react-icons/tb";
import { Avatar, User } from "@nextui-org/react";
import { ImageAnimation } from "../img-animation/ImageAnimation";

export interface IHomeWhyProps {}

export default function HomeWhy(props: IHomeWhyProps) {
  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="">
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
            Tại sao chọn chúng tôi?
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
            Khi ốm đau và sức khỏe, chúng tôi luôn ở đây vì bạn
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
            Chúng tôi thực hiện một cách tiếp cận toàn diện để chăm sóc, nhấn
            mạnh các biện pháp phòng ngừa, phát hiện sớm và kế hoạch điều trị cá
            nhân hóa.
          </motion.p>
        </div>
        <div className="mr-[60px] my-9">
          <div className="flex items-start gap-6 mb-5">
            <motion.div
              initial={{ opacity: 0, x: -3 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full shadow flex-shrink-0 bg-white flex
             items-center justify-center"
            >
              <TbSquareRoundedNumber1 color="#1b3c74" size={28} />
            </motion.div>
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#1b3c74] text-2xl font-bold"
              >
                Chuyên gia giàu kinh nghiệm
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#3c4253] text-lg mt-3"
              >
                Đội ngũ chuyên gia chăm sóc sức khỏe tận tâm của chúng tôi có
                nhiều năm kinh nghiệm và chuyên môn.
              </motion.p>
            </div>
          </div>
          <div className="flex items-start gap-6 mb-5">
            <motion.div
              initial={{ opacity: 0, x: -3 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full shadow flex-shrink-0 bg-white flex items-center justify-center"
            >
              <TbSquareRoundedNumber2 color="1b3c74" size={28} />
            </motion.div>
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#1b3c74] text-2xl font-bold"
              >
                Chăm sóc nhân ái
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#3c4253] text-lg mt-3"
              >
                Chăm sóc nhân ái là khía cạnh quan trọng để đảm bảo sức khỏe và
                sự thoải mái của bệnh nhân.
              </motion.p>
            </div>
          </div>
          <div className="flex items-start gap-6 mb-5">
            <motion.div
              initial={{ opacity: 0, x: -3 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full shadow flex-shrink-0 bg-white flex items-center justify-center"
            >
              <TbSquareRoundedNumber3 color="1b3c74" size={28} />
            </motion.div>
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#1b3c74] text-2xl font-bold"
              >
                Lấy bệnh nhân làm trung tâm
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="text-[#3c4253] text-lg mt-3"
              >
                Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi
                làm việc chặt chẽ với từng bệnh nhân để phát triển các kế hoạch
                chăm sóc sức khỏe.
              </motion.p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center relative">
        <ImageAnimation
          delay={0.3}
          src={Img3.src}
          width={600}
          height={600}
          alt="why"
        ></ImageAnimation>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{
            delay: 1.2,
            type: "spring",
            stiffness: 100,
          }}
          viewport={{ once: true }}
          className="max-w-[250px] bg-white rounded-lg shadow-xl p-4 absolute left-[-85px] bottom-[-60px] z-10"
        >
          <h3 className="text-lg text-[#1b3c74] font-bold ">
            Các bác sĩ có sẵn
          </h3>
          <h3 className="text-base text-[#3c4253] mb-2">Chọn bác sỉ</h3>
          <div className="flex flex-col items-start gap-5">
            <User
              name={"Michael Johnsonsss"}
              description={
                <p className="text-base text-[#3c4253]">Bác sĩ tim mạch</p>
              }
              classNames={{
                name: "text-base text-[#1b3c74] font-bold",
              }}
            >
              <h3 className="text-base text-[#1b3c74] font-bold">
                Michael Johnson
              </h3>
            </User>
            <User
              name={"Jessica Miller"}
              description={<p className="text-base text-[#3c4253]">phụ khoa</p>}
              classNames={{
                name: "text-base text-[#1b3c74] font-bold",
              }}
            >
              <h3 className="text-base text-[#1b3c74] font-bold">
                Jessica Miller
              </h3>
            </User>
            <Button
              size="lg"
              color="primary"
              variant="flat"
              className="font-medium whitespace-normal"
            >
              Gặp gỡ chuyên gia của chúng tôi
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
