"use client";

import {
  API_HEALTH_FACILITIES,
  API_TYPE_HEALTH_FACILITIES,
} from "@/api-services/constant-api";
import { ListHealthFacilities, SeachHealthFacility } from "@/components/common";
import { HealthFacility, TypeHealthFacility } from "@/models";
import { ResData, ResDataPaginations } from "@/types";
import { Breadcrumb, Divider } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import useSWR, { BareFetcher } from "swr";
import axios from "../../axios";

export default function HealthFacilities() {
  const url = usePathname();
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
  const { data: healthFacilities, mutate: mutateHealthFacilities } = useSWR<
    ResDataPaginations<HealthFacility>
  >(
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
    setPagination(() => {
      return {
        current: page,
        pageSize: pageSize,
      };
    });
  }

  return (
    <main className="flex justify-center ">
      <div className="container mt-4">
        <Breadcrumb items={breadcrumbArray} />
        <SeachHealthFacility handleClickSearch={handleClickSearchHealth} />
        <Divider />
        <div className="mb-4">
          <h4 className="text-sm text-gray-400 font-light">Loại cơ sở y tế</h4>
          <div className="mt-4 flex justify-center items-center gap-6">
            {types?.map((row: TypeHealthFacility) => (
              <div
                onClick={() => toggleChoiceType(row.id)}
                key={row.id}
                className={`cursor-pointer px-4 py-2 text-base  rounded-lg  transition duration-500 ${
                  typeChoices.indexOf(row.id) !== -1
                    ? "shadow shadow-[rgba(129,70,91,0.27)] text-[#8e1540]"
                    : "text-gray-500"
                }`}
              >
                <h3>{row.name}</h3>
              </div>
            ))}
          </div>
        </div>

        <ListHealthFacilities
          page={pagination.current}
          onChangePagination={onChangePagination}
          data={healthFacilities}
        />
      </div>
    </main>
  );
}
