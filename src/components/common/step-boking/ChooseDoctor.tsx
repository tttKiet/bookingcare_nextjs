"use client";

import { AudioOutlined } from "@ant-design/icons";
import { Avatar, List } from "antd";
import { SearchProps } from "antd/es/input";
import { CiSearch } from "react-icons/ci";
import { ResDataPaginations } from "@/types";
import {
  AcademicDegree,
  HealthExaminationSchedule,
  Specialist,
  Staff,
  WorkRoom,
  Working,
} from "@/models";
import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_ACEDEMIC_DEGREE,
  API_SPECIALIST,
  API_WORK_ROOM,
  API_WORK_ROOM_GET_FULL_LIST_DOCTOR_WORKING,
} from "@/api-services/constant-api";
import useSWR, { BareFetcher } from "swr";
import { ScheduleBox } from "../schudule.box";
import { useRouter } from "next/navigation";
import DoctorItem from "./DoctorItem";
import { LegacyRef, forwardRef, useMemo, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import {
  Autocomplete,
  AutocompleteItem,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import debounce from "lodash.debounce";
import { SearchIcon } from "@/components/icons/SearchIcon";
import Search from "../filter/Search";
import instances from "@/axios";

import { AnimatePresence, motion, Variants } from "framer-motion";

export interface IChooseDoctorProps {
  healthFacilityId: string;
  next: (step: number, value: any) => void;
}

export interface WorkRoomAndSchedule extends WorkRoom {
  schedules: string[];
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

    return (
      <div
        ref={ref}
        className="min-h-[400px] flex flex-col gap-1 justify-between overflow-x-hidden"
      >
        <div>
          <div>
            <Search
              size="lg"
              label="Tìm nhanh bác sỉ"
              onChange={debounce(function (e) {
                handleSearchName(e.target.value);
              }, 300)}
              placeholder="Nhập tên bác sỉ..."
              color="primary"
            ></Search>
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

          {doctorWorkings?.rows.length == 0 && (
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.6,
              }}
              exit={{ opacity: 0, x: 60 }}
            >
              <div className="flex items-center gap-2 justify-center mt-20">
                Không tìm thấy bác sĩ
              </div>
            </motion.div>
          )}
          <div className="max-h-[400px] min-h-[240px]  my-4 pr-[4px]">
            <AnimatePresence mode="popLayout">
              {doctorWorkings?.rows.map(
                (i: WorkRoomAndSchedule, index: number) => (
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    key={i.id}
                    transition={{
                      delay: 0.3,
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
                )
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
