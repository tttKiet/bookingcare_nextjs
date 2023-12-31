"use client";

import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/constant-api";
import { ListHealthFacilities, SeachHealthFacility } from "@/components/common";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { ResData, ResDataPaginations } from "@/types";
import { Breadcrumb, Button, Divider, Select } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";
import { BsFilterCircle } from "react-icons/bs";
import { useDisPlay } from "@/hooks";

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

  const provinceData = ["Loại"];

  return (
    <main className="mt-[-80px]">
      <div
        className="relative  h-[200px] pt-[80px] "
        style={{
          backgroundImage:
            "linear-gradient(270.3deg, rgb(84, 212, 228) 0.2%, rgb(68, 36, 164) 100%)",
        }}
      >
        <div className="absolute right-0 top-0 w-full h-full overflow-hidden">
          <svg
            viewBox="0 0 1024 1024"
            className="absolute right-0 top-0 z-10 h-[64rem] w-[64rem]  [mask-image:radial-gradient(closest-side,white,transparent)] translate-x-[50%] translate-y-[-50%]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                <stop stopColor="#000" />
                <stop offset={1} stopColor="blue" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <SeachHealthFacility handleClickSearch={handleClickSearchHealth} />
      </div>
      <div className="flex justify-center gap-2 flex-col mt-12 ">
        <h3 className="text-3xl font-semibold text-black text-center">
          Cơ sở y tế
        </h3>

        <p className="text-base text-center text-gray-700 my-3">
          Với những cơ sở Y Tế hàng đầu sẽ giúp trải nghiệm khám, chữa bệnh của
          bạn tốt hơn
        </p>
      </div>
      <div className="flex justify-center min-h-screen">
        <div className="container my-4">
          {/* <Breadcrumb items={breadcrumbArray} /> */}
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
      </div>
    </main>
  );
}
