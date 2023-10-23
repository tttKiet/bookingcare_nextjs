import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import Image from "next/image";
import * as React from "react";
import { ItemHealthFacility } from "./item.health-facility";
import { BoxHealthFacility } from "./box.health-facility";
import { Pagination } from "antd";
import { motion, Variants } from "framer-motion";

export interface IListHealthFacilitiesProps {
  data: ResDataPaginations<HealthFacility> | undefined;
  page: number;
  onChangePagination: (page: number, pageSize: number) => void;
}

export function ListHealthFacilities({
  data,
  onChangePagination,
  page,
}: IListHealthFacilitiesProps) {
  if (data?.rows.length === 0) {
    return (
      <p className="p-5 text-base text-center">
        Không tìm thấy cơ sở y tế phù hợp!
      </p>
    );
  }
  const variants = {
    container: {
      initial: { opacity: 0, x: 100 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          when: "beforeChildren",
          staggerChildren: 3,
        },
      },
    },

    item: {
      initial: { opacity: 0, x: 200 },
      visible: (i: number) => ({
        opacity: 1,
        x: 0,

        transition: {
          delay: i * 0.3,
          duration: 0.2,
        },
      }), // Thay đổi giá trị delay tùy theo nhu cầu
    },
  };

  const [healthFaicilityShow, setHealthFaicilityShow] =
    React.useState<HealthFacility | null>(data?.rows[0] || null);

  function handleClickItem(healthFaicility: HealthFacility): void {
    setHealthFaicilityShow(healthFaicility);
  }

  return (
    <div>
      <motion.div
        animate="visible"
        initial="initial"
        variants={variants.container}
        className="grid grid-cols-12 gap-3 gap-x-8 min-h-[40vh]"
      >
        {data?.rows.map((row: HealthFacility, index: number) => (
          <motion.div
            whileInView="visible"
            initial="initial"
            // custom={index}
            key={row.id}
            className="col-span-12 md:col-span-4"
            variants={variants.item}
          >
            <ItemHealthFacility
              handleClickItem={handleClickItem}
              healthFaicility={row}
            />
          </motion.div>
        ))}

        {/* <div className="col-span-5">
          <BoxHealthFacility healthFaicility={healthFaicilityShow} />
        </div> */}
      </motion.div>
      <div className="col-span-12 mt-0">
        <Pagination
          onChange={onChangePagination}
          className="mt-3"
          defaultCurrent={page}
          total={data?.count || 1}
        />
      </div>
    </div>
  );
}
