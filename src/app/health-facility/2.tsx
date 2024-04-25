"use client";

import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/constant-api";
import { ListHealthFacilities, SeachHealthFacility } from "@/components/common";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { ResData, ResDataPaginations } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import { BsFilterCircle } from "react-icons/bs";
import { useDisPlay } from "@/hooks";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Checkbox,
  Divider,
  Input,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import Search from "@/components/common/filter/Search";
import { SelectSearchField } from "@/components/form";
import Select from "@/components/common/filter/Select";

export default function HealthFacilities() {
  const url = usePathname();
  const { scrollTo } = useDisPlay();
  const listHealRef = useRef(null);
  const breadcrumbArraySplit = url.toString().split("/");
  const breadcrumbArray = breadcrumbArraySplit.map((path, index, arrayThis) => {
    if (!path) return {};
    return {
      title:
        index + 1 === arrayThis.length ? (
          path
        ) : (
          <Link href={url.slice(0, url.indexOf(path)) + path}>{path}</Link>
        ),
    };
  });
  breadcrumbArray.unshift({
    title: <Link href="/">Home</Link>,
  });
  const [typeChoices, setTypeChoices] = useState<string[]>([]);
  const [searchNameHealthValue, setSearchNameHealthValue] =
    useState<string>("");

  const [pagination, setPagination] = useState<{
    current: number;
    pageSize: number;
  }>({
    current: 1,
    pageSize: 6,
  });

  // GET type
  const { data: types, mutate: mutateTypeHealth } = useSWR<
    Array<TypeHealthFacility>
  >(API_TYPE_HEALTH_FACILITIES, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  // GET health facilities
  const fetcher: BareFetcher<ResDataPaginations<HealthFacility>> = async ([
    url,
    token,
  ]) =>
    (
      await axios.get(url, {
        params: {
          ...token,
        },
      })
    ).data;
  const {
    data: healthFacilities,
    mutate: mutateHealthFacilities,
    isLoading,
  } = useSWR<ResDataPaginations<HealthFacility>>(
    [
      API_HEALTH_FACILITIES,
      {
        name: searchNameHealthValue,
        typeHealthFacilityId: [...typeChoices],
        limit: pagination.pageSize, // 4 page 2 => 3, 4 page 6 => 21
        offset: ((pagination.current || 0) - 1) * (pagination.pageSize || 0),
      },
    ],
    fetcher,
    {
      revalidateOnMount: true,
      dedupingInterval: 5000,
    }
  );

  function toggleChoiceType(id: string): void {
    setPagination(() => {
      return {
        current: 1,
        pageSize: 6,
      };
    });
    setTypeChoices((prev) => {
      const isExited = prev.indexOf(id);
      if (isExited !== -1) {
        const newChoices = prev.filter((c) => c !== id);
        return newChoices;
      } else {
        return [...prev, id];
      }
    });
  }

  function handleClickSearchHealth(value: string): void {
    setSearchNameHealthValue(value);
    setTypeChoices([]);
  }
  function onChangePagination(page: number, pageSize: number): void {
    scrollTo(listHealRef?.current, {
      top: 270,
    });
    setPagination(() => {
      return {
        current: page,
        pageSize: pageSize,
      };
    });
  }

  const box_filter = "";

  const provinceData = ["Loại"];

  return (
    <main className="">
      <div className="mt-12 ">
        <div className="container mx-auto">
          <div className="text-[#1b3c74] text-4xl font-medium">
            Tìm kiếm bác sĩ
          </div>

          <Breadcrumbs
            radius={"md"}
            variant="solid"
            className="mt-4 font-medium"
          >
            <BreadcrumbItem>
              <Link href={"/"}>Home</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Tìm kiếm bác sỉ</BreadcrumbItem>
          </Breadcrumbs>
        </div>
        {/* <div className="relative  h-[200px] pt-[80px]  ">
          <SeachHealthFacility handleClickSearch={handleClickSearchHealth} />
        </div> */}
        <div className="   my-8 py-8">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 gap-4 ">
              <div className="col-span-3">
                <div className={`${box_filter} text-left text-lg font-medium`}>
                  Bộ lọc nhanh
                </div>
                <div className=" text-left mt-2">
                  <div className="mb-3">
                    <h3 className="text-base font-medium">Theo giá khám</h3>
                    <Checkbox value="buenos-aires">Dưới 100.000 vnđ</Checkbox>
                    <Checkbox value="buenos-aires">Dưới 500.000 vnđ</Checkbox>
                    <Checkbox value="buenos-aires">Dưới 1.000.000 vnđ</Checkbox>
                    <Checkbox value="buenos-aires">Dưới 2.000.000 vnđ</Checkbox>
                    <Checkbox value="buenos-aires">Trên 2.000.000 vnđ</Checkbox>
                  </div>
                  <div className="mb-3">
                    <h3 className="text-base font-medium">Theo đánh giá</h3>

                    <div className="flex flex-col gap-1">
                      <Checkbox value="buenos-aires">5 sao</Checkbox>
                      <Checkbox value="sydney">Từ 4 sao</Checkbox>
                      <Checkbox value="sydney">Từ 3 sao</Checkbox>
                      <Checkbox value="sydney">Từ 2 sao</Checkbox>
                      <Checkbox value="sydney">Từ 1 sao</Checkbox>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-9 min-h-screen">
                <div className={`${box_filter} grid grid-cols-12 gap-4`}>
                  <div className="col-span-5">
                    <Search
                      color="default"
                      placeholder="Tìm kiếm tên bác sĩ"
                    ></Search>
                  </div>
                  <div className="col-span-5">
                    <Search
                      color="default"
                      placeholder="Tìm kiếm cơ sở y tế"
                    ></Search>
                  </div>
                  <div className="col-span-2">
                    <Select
                      items={[
                        {
                          label: "---Tat ca---",
                          value: "0",
                        },
                      ]}
                      children={<div></div>}
                      title="Chuyên khoa"
                      placeholder="Chuyên khoa"
                    />
                  </div>

                  <div className="col-span-12">
                    <Input
                      label="Chuyên khoa"
                      color="default"
                      placeholder="--Tất cả--"
                    ></Input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2 flex-col mt-12 min-h-screen"></div>
        {/* <div className="flex justify-center min-h-screen">
          <div className="container my-4">
            <div className="my-4 mb-8 flex justify-between items-center gap-6">
              <Select
                defaultValue={provinceData[0]}
                style={{ width: 120 }}
                options={provinceData.map((province) => ({
                  label: province,
                  value: province,
                }))}
              />
              <div className="flex items-center justify-center gap-2">
                {types?.map((row: TypeHealthFacility) => (
                  <Button
                    onClick={() => toggleChoiceType(row.id)}
                    key={row.id}
                    className={`flex-shrink-0 cursor-pointer font-semibold  text-sm 
                       rounded-3xl  transition duration-500 ${
                         typeChoices.indexOf(row.id) !== -1
                           ? "shadow  bg-[#f8f7f4]"
                           : "text-black bg-transparent"
                       }`}
                    type="text"
                  >
                    {row.name}
                  </Button>
                ))}
              </div>
              <Button
                type="dashed"
                className="rounded-3xl flex items-center gap-2"
              >
                <BsFilterCircle />
                Lọc
              </Button>
            </div>
            <div ref={listHealRef}></div>
            <ListHealthFacilities
              isLoading={isLoading}
              page={pagination.current}
              onChangePagination={onChangePagination}
              data={healthFacilities}
            />
          </div>
        </div> */}
      </div>
    </main>
  );
}
