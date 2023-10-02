import { HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import Image from "next/image";
import * as React from "react";
import { ItemHealthFacility } from "./item.health-facility";
import { BoxHealthFacility } from "./box.health-facility";
import { Pagination } from "antd";

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

  const [healthFaicilityShow, setHealthFaicilityShow] =
    React.useState<HealthFacility | null>(data?.rows[0] || null);

  function handleClickItem(healthFaicility: HealthFacility): void {
    setHealthFaicilityShow(healthFaicility);
  }

  return (
    <div className="grid grid-cols-12 gap-3 gap-x-8">
      <div className="col-span-7">
        {data?.rows.map((row: HealthFacility) => (
          <ItemHealthFacility
            handleClickItem={handleClickItem}
            key={row.id}
            healthFaicility={row}
          />
        ))}
        <Pagination
          onChange={onChangePagination}
          className="mt-3"
          defaultCurrent={page}
          total={data?.count || 1}
        />
      </div>
      <div className="col-span-5">
        <BoxHealthFacility healthFaicility={healthFaicilityShow} />
      </div>
    </div>
  );
}
