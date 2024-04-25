import Slider from "react-slick";
import SlideService from "./SlideService";
import { useRef } from "react";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

export interface IHomeServiceProps {}

export default function HomeService(props: IHomeServiceProps) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 1,
  };
  let sliderRef: any = useRef(null);
  return (
    <div>
      <div className="mb-16 mt-36">
        <motion.h2
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 100,
          }}
          viewport={{ once: true }}
          className="text-[#2490eb] text-xl  font-medium mb-3"
        >
          Phòng ban của chúng tôi
        </motion.h2>
        <motion.h4
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 100,
          }}
          viewport={{ once: true }}
          className="text-[#1b3c74] text-5xl font-medium"
        >
          Dịch vụ cho sức khỏe của bạn
        </motion.h4>
      </div>
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
        <Slider
          {...settings}
          className="w-full "
          ref={(slider) => {
            if (slider) sliderRef = slider;
          }}
        >
          <SlideService />
          <SlideService />
          <SlideService />
          <SlideService />
        </Slider>
        <div className="flex items-center justify-center mt-8 gap-4">
          <Button
            color="primary"
            variant="light"
            onPress={() => sliderRef.slickPrev()}
          >
            <FaArrowLeft size={18} />
          </Button>
          <Button
            color="primary"
            variant="light"
            onPress={() => sliderRef.slickNext()}
          >
            <FaArrowRight size={18} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
