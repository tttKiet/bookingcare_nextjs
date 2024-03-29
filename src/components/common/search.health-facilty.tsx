"use client";

import { Select } from "antd";
import axios, { AxiosResponse } from "axios";
import { ChangeEvent, KeyboardEvent, useMemo, useState } from "react";
import { CiLocationOn, CiSearch } from "react-icons/ci";
import useSWR, { BareFetcher } from "swr";

export interface SeachHealthFacilityProps {
  handleClickSearch: (value: string) => void;
}

export interface Province {
  code: number;
  codename: string;
  districts: Array<any>;
  division_type: string;
  name: string;
  phone_code: number;
}

export function SeachHealthFacility({
  handleClickSearch,
}: SeachHealthFacilityProps) {
  const fetcher: BareFetcher<Array<Province>> = async () =>
    (await axios.get("https://provinces.open-api.vn/api/")).data;

  const { data: listProvinces } = useSWR(
    "https://provinces.open-api.vn/api/",
    fetcher,
    {
      revalidateOnMount: true,
    }
  );

  const optionSelectProvinces = useMemo(() => {
    return listProvinces?.map((province) => {
      return {
        value: province.code,
        label: province.name,
      };
    });
  }, [listProvinces]);

  const [valueSelectLocation, setValueSelectLocation] = useState<string | null>(
    null
  );
  const [searchHealthValue, setSearchHealthValue] = useState<string>("");

  function handleChangeSearch(e: ChangeEvent<HTMLInputElement>): void {
    setSearchHealthValue(e.target.value);
  }

  function onChangeSelectLocation(value: string): void {
    setValueSelectLocation(value);
  }

  function handleClickEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleClickSearch(searchHealthValue);
    }
  }

  return (
    <div className="absolute left-[50%] z-30 top-full translate-y-[-50%] translate-x-[-50%]">
      <div className="flex justify-center">
        <div className="rounded-lg relative bg-white shadow py-1 px-7 grid grid-cols-1 md:grid-cols-2 gap-x-2">
          <div className="flex items-center  justify-start gap-1 px-[calc(11px+1rem)]">
            <input
              type="text"
              className="h-[38px] border border-transparent outline-none min-w-[100px] w-full text-base
                placeholder:italic placeholder:font-light leading-[38px] 
              "
              placeholder="Tìm kiếm cơ sở y tế ..."
              spellCheck="false"
              value={searchHealthValue}
              onChange={handleChangeSearch}
              onKeyDown={handleClickEnter}
            />
            <span
              className="p-3 cursor-pointer"
              onClick={() => handleClickSearch(searchHealthValue)}
            >
              <CiSearch
                size={20}
                className="flex-shrink-0 text-[#c2c2c2]   hover:text-black transition duration-500"
              />
            </span>
          </div>
          <hr className="my-3 mx-2 md:hidden" />
          <span className="md:block hidden w-[1px] bg-gray-900 h-[18px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"></span>
          <div className="flex items-center justify-start gap-1 px-[calc(1rem)] ">
            <Select
              value={valueSelectLocation}
              placement="bottomLeft"
              style={{ width: "100%" }}
              size="large"
              removeIcon
              suffixIcon={<CiLocationOn size={20} />}
              onChange={onChangeSelectLocation}
              placeholder="Chọn tỉnh thành ..."
              virtual={false}
              showSearch
              bordered={false}
              optionFilterProp="children"
              notFoundContent={<div className="px-4">Khônng tìm thây...</div>}
              options={optionSelectProvinces || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
