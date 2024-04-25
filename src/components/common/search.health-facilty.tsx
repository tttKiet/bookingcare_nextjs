"use client";

import { Input } from "@nextui-org/react";
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
    <div className="absolute left-[50%] z-30 top-full translate-y-[-50%] rounded-md translate-x-[-50%] bg-white w-3/5 ">
      <Input
        size="lg"
        type="text"
        variant="underlined"
        color="primary"
        radius="md"
        classNames={{
          input: "px-8 pt-0",
          inputWrapper: "py-0",
          innerWrapper: "py-0",
          // base: "bg-white",
          // mainWrapper: "bg-white",
          // base: 'bg-white'
          // helperWrapper: "bg-white",
        }}
        // className="h-[38px] border border-transparent outline-none min-w-[100px]  w-full text-base
        //         placeholder:italic placeholder:font-light leading-[38px]
        //
        // className="bg-white "
        placeholder="Tìm kiếm cơ sở y tế ..."
        spellCheck="false"
        value={searchHealthValue}
        onChange={handleChangeSearch}
        onKeyDown={handleClickEnter}
        endContent={
          <div className="w-5 h-5 flex items-center justify-center mr-8">
            <CiSearch size={22} />
          </div>
        }
      />
    </div>
  );
}
