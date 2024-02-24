import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import Image from "next/image";
import { ItemHealthFacility } from "./item.health-facility";
import { BoxHealthFacility } from "./box.health-facility";
import { Pagination } from "antd";
import { motion, Variants } from "framer-motion";

export interface IListHealthFacilitiesProps {
  data: ResDataPaginations<HealthFacility> | undefined;
  page: number;
  isLoading: boolean;
  onChangePagination: (page: number, pageSize: number) => void;
}

export function ListHealthFacilities({
  data,
  onChangePagination,
  page,
  isLoading,
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
      initial: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          when: "beforeChildren",
          staggerChildren: 3,
        },
      },
    },

    item: {
      initial: { opacity: 0 },
      visible: (i: number) => ({
        opacity: 1,
        transition: {
          delay: i * 0.3,
          duration: 0.2,
        },
      }), // Thay đổi giá trị delay tùy theo nhu cầu
    },
  };

  return (
    <div>
      <motion.div
        animate="visible"
        initial="initial"
        variants={variants.container}
        className="grid grid-cols-12  gap-8 min-h-[40vh]"
      >
        {data?.rows.map((row: HealthFacility, index: number) => (
          <motion.div
            whileInView="visible"
            initial="initial"
            // custom={index}
            key={row.id}
            className="col-span-12 md:col-span-6 lg:col-span-4"
            variants={variants.item}
          >
            <ItemHealthFacility
              handleClickItem={() => {}}
              healthFaicility={row}
            />
          </motion.div>
        ))}

        {/* <div className="col-span-5">
          <BoxHealthFacility healthFaicility={healthFaicilityShow} />
        </div> */}
      </motion.div>

      {!isLoading && (
        <div className="col-span-12 mt-0">
          <Pagination
            onChange={onChangePagination}
            className="mt-6"
            defaultCurrent={1}
            current={page}
            pageSize={6}
            total={data?.count || 1}
          />
        </div>
      )}
    </div>
  );
}
