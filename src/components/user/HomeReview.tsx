"use client";

import Slider from "react-slick";
import SlideService from "./SlideService";
import { useRef } from "react";
import { Button } from "@nextui-org/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import useSWR from "swr";
import {
  API_ADMIN_EXAMINATION_SERVICE,
  API_REVIEW_DOCTOR,
} from "@/api-services/constant-api";
import { ExaminationService, Review } from "@/models";
import { ResDataPaginations } from "@/types";
import SlideReview from "./SlideReview";

export default function HomeReview() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  let sliderRef: any = useRef(null);

  const { data: resReviewTop } = useSWR<ResDataPaginations<Review>>(
    `${API_REVIEW_DOCTOR}?offset=0&limit=10&type=all&starNumber=5`
  );

  return (
    <div>
      <div className="mb-24 mt-36 ">
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
          Các đánh giá nổi bật
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
          Người dùng nói gì về bác sĩ của chúng tôi
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
          {resReviewTop?.rows.map((s: Review) => (
            <SlideReview s={s} key={s.id} />
          ))}
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
