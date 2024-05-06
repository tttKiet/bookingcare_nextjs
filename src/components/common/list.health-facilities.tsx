import { HealthFacility, HealthFacilityStar } from "@/models";
import { ResDataPaginations } from "@/types";
import { ItemHealthFacility } from "./item.health-facility";
// import { Pagination } from "antd";
import {
  Chip,
  Divider,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { NotificationIcon } from "../icons/NotificationIcon";
import { IoFilterCircle } from "react-icons/io5";
import { BsFilterCircle } from "react-icons/bs";
import { useEffect, useMemo, useState } from "react";
import {
  HiArrowSmallUp,
  HiArrowSmallDown,
  HiArrowsUpDown,
} from "react-icons/hi2";

export interface IListHealthFacilitiesProps {
  data: ResDataPaginations<HealthFacilityStar> | undefined;
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
  const [datafilter, setDatafilter] = useState<HealthFacilityStar[]>(
    data?.rows || []
  );
  const [filter, setFilter] = useState<{
    name: string;
    review: string;
  }>({
    name: "all",
    review: "all",
  });
  const reviewOptions = useMemo(() => {
    return [
      {
        value: "all",
        startContent: <HiArrowsUpDown />,
        label: "Mặc định",
      },
      {
        value: "asc",
        label: "Tăng",
        startContent: <HiArrowSmallUp />,
      },

      {
        value: "desc",
        startContent: <HiArrowSmallDown />,
        label: "Giảm",
      },
    ];
  }, []);

  const nameOptions = useMemo(() => {
    return [
      {
        value: "all",
        label: "Mặc định",
      },
      {
        value: "asc",
        label: "a -> z",
      },

      {
        value: "desc",
        label: "z -> a",
      },
    ];
  }, []);

  function onFilter(filter: Partial<{ name: string; review: string }>) {
    setFilter((s) => ({ ...s, ...filter }));
  }

  useEffect(() => {
    console.log(filter);
    setDatafilter((pre) => {
      if (filter.name == "all" && filter.review == "all") {
        return data?.rows || [];
      }

      const resultArray = pre
        .sort((a, b) => {
          if (filter.name === "asc") {
            return a.name.localeCompare(b.name);
          } else if (filter.name === "desc") {
            return b.name.localeCompare(a.name);
          } else {
            return 0;
          }
        })
        .sort((a, b) => {
          if (filter.review === "asc") {
            return a.reviewIndex.avg - b.reviewIndex.avg;
          } else if (filter.review === "desc") {
            return b.reviewIndex.avg - a.reviewIndex.avg;
          } else {
            return 0;
          }
        });
      return [...resultArray];
    });
  }, [data, filter]);

  useEffect(() => {
    console.log("eef");
    setDatafilter(data?.rows || []);
  }, [data]);

  return (
    <div>
      <div className="col-span-12 mt-0 ">
        <div className="flex justify-between items-center gap-4 mb-4">
          {/* {!isLoading && data?.rows.length > 0 && ( */}
          <div className="flex-1 flex items-center gap-4">
            <BsFilterCircle size={22} />
            <div className=" flex items-center space-x-4">
              <div className="flex-1 flex items-center gap-3">
                <span className="whitespace-nowrap font-medium"> Đánh giá</span>
                <Select
                  classNames={{}}
                  aria-label="12"
                  variant="bordered"
                  selectionMode="single"
                  defaultSelectedKeys={["all"]}
                  selectedKeys={[filter.review]}
                  disallowEmptySelection
                  size="sm"
                  onChange={(e) => onFilter({ review: e.target.value })}
                  className="w-36"
                >
                  {reviewOptions.map((review) => (
                    <SelectItem
                      startContent={review.startContent}
                      key={review.value}
                      textValue={review.label}
                      value={review.value}
                    >
                      {review.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Divider orientation="vertical" className="h-5" />

              <div className="flex-1 flex items-center gap-3">
                <span className="whitespace-nowrap font-medium"> Tên</span>
                <Select
                  size="sm"
                  aria-label="ht"
                  classNames={{}}
                  variant="bordered"
                  defaultSelectedKeys={["all"]}
                  selectionMode="single"
                  selectedKeys={[filter.name]}
                  onChange={(e) => onFilter({ name: e.target.value })}
                  className="w-36"
                >
                  {nameOptions.map((review) => (
                    <SelectItem
                      key={review.value}
                      textValue={review.label}
                      value={review.value}
                    >
                      {review.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
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
          {/* )} */}
        </div>

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

        {datafilter.length == 0 && (
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
        className="grid grid-cols-12 gap-8  min-h-screen pb-20"
        // style={{ height: "fit-content", }}
      >
        <AnimatePresence mode="popLayout">
          {datafilter.map((row: HealthFacilityStar, index: number) => (
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                // delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                duration: 1,
                delay: index * 0.02 + 0.08,
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
