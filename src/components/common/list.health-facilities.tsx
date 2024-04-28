import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import { ItemHealthFacility } from "./item.health-facility";
// import { Pagination } from "antd";
import { Chip, Divider, Pagination } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationIcon } from "../icons/NotificationIcon";

export interface IListHealthFacilitiesProps {
  data: ResDataPaginations<HealthFacility> | undefined;
  page: number;
  isLoading: boolean;
  searchNameHealthValue: string;
  pageSize: number;
  onChangePagination: (page: number, pageSize: number) => void;
}

export function ListHealthFacilities({
  data,
  onChangePagination,
  page,
  isLoading,
  searchNameHealthValue,
  pageSize,
}: IListHealthFacilitiesProps) {
  return (
    <div>
      <div className="col-span-12 mt-0 ">
        {/* <Pagination
            onChange={onChangePagination}
            className="mt-6"
            defaultCurrent={1}
            current={page}
            pageSize={6}
            total={data?.count || 1}
          /> */}

        <div className="flex justify-between items-center gap-3   mb-8">
          <div>
            {searchNameHealthValue && (
              <>
                <span className="mr-2 font-medium text-[#000] text-xl">
                  Tìm kiếm tên cơ sở:
                </span>
                <span className="text-xl">"{searchNameHealthValue}"</span>
              </>
            )}
          </div>
          {!isLoading && data?.rows.length > 0 && (
            <div className="flex justify-end items-center space-x-4  ">
              <div>
                <span className="mr-2 font-medium text-[#000]">Tống số:</span>
                <span>{data?.count || 0}</span>
              </div>
              <Divider orientation="vertical" className="h-5" />
              <Pagination
                page={page}
                defaultValue={1}
                total={Math.round((data?.count || 1) / pageSize) || 1}
                initialPage={1}
                onChange={(e) => {
                  onChangePagination(e, pageSize);
                }}
              />
            </div>
          )}
        </div>

        {data?.rows.length == 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.5,
              }}
              exit={{ opacity: 0, x: 60 }}
              className="p-5 text-xl font-medium text-center min-h-screen"
            >
              <Chip
                color="warning"
                variant="flat"
                startContent={<NotificationIcon size={20} />}
              >
                Không tìm thấy cơ sở y tế phù hợp!
              </Chip>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div
        className="grid grid-cols-12 gap-8  min-h-screen"
        // style={{ height: "fit-content", }}
      >
        <AnimatePresence mode="popLayout">
          {data?.rows.map((row: HealthFacility, index: number) => (
            // <div
            //   key={row.id}
            //   className="col-span-12 md:col-span-6 lg:col-span-3"
            // >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                // delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                duration: 1,
                delay: index * 0.2,
              }}
              exit={{ opacity: 0, y: 60, scale: 0.8 }}
              viewport={{ once: true }}
              className="col-span-12 md:col-span-6 lg:col-span-3"
              key={row.id}
            >
              <ItemHealthFacility
                handleClickItem={() => {}}
                healthFaicility={row}
              />
            </motion.div>
            // </div>
          ))}
        </AnimatePresence>

        {/* <div className="col-span-5">
          <BoxHealthFacility healthFaicility={healthFaicilityShow} />
        </div> */}
      </div>
    </div>
  );
}
