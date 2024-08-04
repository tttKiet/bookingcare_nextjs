"use client";

import {
  API_ACEDEMIC_DEGREE,
  API_SPECIALIST,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import instances from "@/axios";
import { AcademicDegree, Specialist, WorkRoom } from "@/models";
import { ResDataPaginations } from "@/types";
import { Button } from "@nextui-org/button";
import {
  Autocomplete,
  AutocompleteItem,
  Select,
  SelectItem,
} from "@nextui-org/react";
import debounce from "lodash.debounce";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LegacyRef,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR, { BareFetcher } from "swr";
import Search from "../filter/Search";
import DoctorItem from "./DoctorItem";

import { AnimatePresence, motion } from "framer-motion";
import {
  HiArrowSmallDown,
  HiArrowSmallUp,
  HiArrowsUpDown,
} from "react-icons/hi2";

export interface IChooseDoctorProps {
  healthFacilityId: string;
  next: (step: number, value: any) => void;
}

export interface WorkRoomAndSchedule extends WorkRoom {
  schedules: string[];
  starNumber: number;
}
const ChooseDoctor = forwardRef(
  (
    { healthFacilityId, next }: IChooseDoctorProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const router = useRouter();
    const [searchName, setSearchName] = useState<string>("");
    const [searchSpecialist, setSearchSpecialist] = useState<string>("");
    const [searchAcedemic, setSearchAcedemic] = useState<string>("");
    const [searchGender, setSearchGender] = useState<string>("");
    const refDoctor = useRef(null);

    // GET health facilities
    const fetcher: BareFetcher<
      ResDataPaginations<WorkRoomAndSchedule>
    > = async ([url, token]) =>
      (
        await instances.get(url, {
          params: {
            ...token,
          },
        })
      ).data;

    const {
      data: doctorWorkings,
      mutate: mutateDoctorWorkings,
      isLoading,
    } = useSWR<ResDataPaginations<WorkRoomAndSchedule>>(
      [
        `${API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING}`,
        {
          healthFacilityId: healthFacilityId || "",
          doctorName: searchName,
          specialistId: searchSpecialist,
          academicDegreeId: searchAcedemic,
          gender: searchGender,
        },
      ],
      fetcher,
      {
        revalidateOnMount: true,
        dedupingInterval: 5000,
      }
    );

    const { data: dataSpecialists } =
      useSWR<ResDataPaginations<Specialist>>(API_SPECIALIST);
    const { data: dataAcedemics } =
      useSWR<ResDataPaginations<AcademicDegree>>(API_ACEDEMIC_DEGREE);
    const opSpecialists: {
      label: string;
      value: string;
    }[] = useMemo(() => {
      const ops =
        dataSpecialists?.rows.map((s: Specialist) => ({
          label: s.name,
          value: s.id,
        })) || [];
      return [
        {
          label: "-- Tất cả --",
          value: "",
        },
        ...ops,
      ];
    }, [dataSpecialists]);

    const [datafilter, setDatafilter] = useState<WorkRoomAndSchedule[]>(
      doctorWorkings?.rows || []
    );
    const [filter, setFilter] = useState<{
      starNumber: string;
      price: string;
    }>({
      starNumber: "all",
      price: "all",
    });

    const opGender = useMemo(() => {
      return [
        {
          label: "-- Tất cả --",
          value: "",
        },
        {
          label: "Nam",
          value: "male",
        },
        {
          label: "Nữ",
          value: "female",
        },
      ];
    }, []);
    function onFilter(filter: Partial<{ price: string; starNumber: string }>) {
      setFilter((s) => ({ ...s, ...filter }));
    }
    useEffect(() => {
      setDatafilter((pre) => {
        if (filter.starNumber == "all" && filter.price == "all") {
          return doctorWorkings?.rows || [];
        }

        const resultArray = pre
          .sort((a, b) => {
            if (filter.starNumber === "asc") {
              return a.starNumber - b.starNumber;
            } else if (filter.starNumber === "desc") {
              return b.starNumber - a.starNumber;
            } else {
              return 0;
            }
          })
          .sort((a, b) => {
            if (filter.price === "asc") {
              return a.checkUpPrice - b.checkUpPrice;
            } else if (filter.price === "desc") {
              return b.checkUpPrice - a.checkUpPrice;
            } else {
              return 0;
            }
          });

        return [...resultArray];
      });
    }, [doctorWorkings, filter]);

    useEffect(() => {
      setDatafilter(doctorWorkings?.rows || []);
    }, [doctorWorkings]);

    const opAcedemics = useMemo(() => {
      const ops =
        dataAcedemics?.rows.map((s: AcademicDegree) => ({
          label: s.name,
          value: s.id,
        })) || [];
      return [
        {
          label: "-- Tất cả --",
          value: "",
        },
        ...ops,
      ];
    }, [dataAcedemics]);

    // filter
    const options = useMemo(() => {
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

    const searchPagrams = useSearchParams();
    const doctorId = searchPagrams.get("doctorId");

    const [item, setItem] = useState<WorkRoom | null>(null);

    function handleClickCard(item: WorkRoomAndSchedule) {
      setItem(item);
    }

    function handleClickContinue() {
      next(1, item);
    }

    function handleSearchName(value: string) {
      setSearchName(value);
    }

    useEffect(() => {
      if (doctorId) {
        const item = datafilter.find((s) => s.Working.staffId == doctorId);

        if (item) setItem(item);
      }
    }, [doctorId, datafilter]);

    return (
      <div
        ref={ref}
        className="min-h-[400px] flex flex-col gap-1 justify-between overflow-x-hidden"
      >
        <div>
          <div>
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <Search
                  size="md"
                  label="Tìm nhanh Bác sĩ"
                  onChange={debounce(function (e) {
                    handleSearchName(e.target.value);
                  }, 300)}
                  placeholder="Nhập tên Bác sĩ..."
                  color="primary"
                ></Search>
              </div>
              <div className="col-span-3">
                <Select
                  classNames={{}}
                  color="primary"
                  aria-label="12"
                  variant="bordered"
                  selectionMode="single"
                  label="Đánh giá"
                  defaultSelectedKeys={["all"]}
                  selectedKeys={[filter.starNumber]}
                  disallowEmptySelection
                  size="md"
                  onChange={(e) => onFilter({ starNumber: e.target.value })}
                  className="w-full"
                >
                  {options.map((data) => (
                    <SelectItem
                      startContent={data.startContent}
                      key={data.value}
                      textValue={data.label}
                      value={data.value}
                    >
                      {data.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="col-span-3">
                <Select
                  classNames={{}}
                  color="primary"
                  aria-label="12"
                  variant="bordered"
                  selectionMode="single"
                  label="Giá khám"
                  defaultSelectedKeys={["all"]}
                  selectedKeys={[filter.price]}
                  disallowEmptySelection
                  size="md"
                  onChange={(e) => onFilter({ price: e.target.value })}
                  className="w-full"
                >
                  {options.map((data) => (
                    <SelectItem
                      startContent={data.startContent}
                      key={data.value}
                      textValue={data.label}
                      value={data.value}
                    >
                      {data.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              <Autocomplete
                onSelectionChange={(e) => {
                  setSearchSpecialist(e?.toString() || "");
                }}
                color="primary"
                variant="bordered"
                label="Chuyên khoa"
                size="md"
                selectedKey={searchSpecialist}
                labelPlacement="inside"
              >
                {opSpecialists?.map((item) => (
                  <AutocompleteItem
                    key={item.value || ""}
                    value={item?.value || ""}
                    textValue={item?.label || ""}
                  >
                    {item.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                onSelectionChange={(e) => {
                  setSearchAcedemic(e?.toString() || "");
                }}
                color="primary"
                variant="bordered"
                label="Hàm/học vị"
                size="md"
                selectedKey={searchAcedemic}
                labelPlacement="inside"
              >
                {opAcedemics?.map((item) => (
                  <AutocompleteItem
                    key={item.value || ""}
                    value={item?.value || ""}
                    textValue={item?.label || ""}
                  >
                    {item.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
              <Autocomplete
                onSelectionChange={(e) => {
                  setSearchGender(e?.toString() || "");
                }}
                color="primary"
                variant="bordered"
                label="Giới tính"
                size="md"
                selectedKey={searchGender}
                labelPlacement="inside"
              >
                {opGender?.map((item) => (
                  <AutocompleteItem
                    key={item.value || ""}
                    value={item?.value || ""}
                    textValue={item?.label || ""}
                  >
                    {item.label}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            </div>
          </div>

          <div className="max-h-[400px] min-h-[300px] overflow-y-auto overflow-x-hidden my-4 pr-[8px]">
            <AnimatePresence mode="wait">
              {datafilter?.map((i: WorkRoomAndSchedule, index: number) => (
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  key={i.id}
                  className="my-5"
                  transition={{
                    delay: 0.1,
                  }}
                  exit={{ opacity: 0, x: 60 }}
                >
                  <DoctorItem
                    key={i.id}
                    active={item?.Working.staffId === i.Working.staffId}
                    workRoomAndSchedule={i}
                    handleClickCard={handleClickCard}
                    index={index}
                  />
                </motion.div>
              ))}
              {datafilter?.length == 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.4,
                  }}
                  exit={{ opacity: 0, x: 60 }}
                >
                  <div className="flex items-center gap-2 justify-center mt-20">
                    Không tìm thấy bác sĩ
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end gap-4 py-5">
          <Button onClick={() => router.back()} size="md">
            Trở lại
          </Button>
          <Button
            color={item ? "primary" : "default"}
            size="md"
            onClick={handleClickContinue}
            className={item ? "cursor-pointer" : "cursor-default select-none"}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }
);

export { ChooseDoctor };
