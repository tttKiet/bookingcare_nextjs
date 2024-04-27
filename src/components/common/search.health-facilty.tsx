"use client";

import { Divider, Input } from "@nextui-org/react";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaXmark } from "react-icons/fa6";

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
  const [searchHealthValue, setSearchHealthValue] = useState<string>("");

  function handleChangeSearch(e: ChangeEvent<HTMLInputElement>): void {
    setSearchHealthValue(e.target.value);
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
        }}
        // isClearable={true}
        // onClear={() => {
        //   setSearchHealthValue("");
        //   handleClickSearch("");
        // }}
        placeholder="Tìm kiếm cơ sở y tế ..."
        spellCheck="false"
        value={searchHealthValue}
        onChange={handleChangeSearch}
        onKeyDown={handleClickEnter}
        endContent={
          <div className="flex items-center space-x-3 justify-center mr-4">
            {searchHealthValue && (
              <div
                onClick={() => {
                  setSearchHealthValue("");
                  handleClickSearch("");
                }}
                className="w-10 h-10 text-danger-500 flex items-center justify-center cursor-pointer 
              hover:opacity-80 hover:text-danger-400 transition-all"
              >
                <FaXmark size={14} />
              </div>
            )}
            <Divider orientation="vertical" className="h-5" />
            <div
              onClick={() => handleClickSearch(searchHealthValue)}
              className="w-10 h-10 flex items-center justify-center cursor-pointer hover:opacity-80 hover:text-blue-500 transition-all"
            >
              <CiSearch size={22} />
            </div>
          </div>
        }
      />
    </div>
  );
}
