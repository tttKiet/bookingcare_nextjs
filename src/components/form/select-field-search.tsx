"use client";

import {
  API_HEALTH_FACILITIES,
  API_HEALTH_FACILITY_ROOM,
} from "@/api-services/constant-api";
import { ClinicRoom, HealthFacility } from "@/models";
import { ResDataPaginations } from "@/types";
import type { SelectProps } from "antd";
import { Select } from "antd";
import axios from "../../axios";
import debounce from "lodash.debounce";
import useSWR, { BareFetcher } from "swr";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/react";
import { ChangeEvent } from "react";
export interface SelectSearchFieldProps {
  title?: string;
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  value: string | null | undefined;
  data: SelectProps["options"];
  handleSearchSelect: (value: string) => void;
  handleChangeSelect: (value: string) => void;
  allowClear?: boolean;
}

export function SelectSearchField({
  placeholder,
  style,
  debounceSeconds,
  data,
  handleSearchSelect,
  handleChangeSelect,
  value,
  title,
  allowClear = true,
}: SelectSearchFieldProps) {
  const handleSearch = (newValue: string) => {
    if (newValue) handleSearchSelect(newValue);
  };

  const handleChange = (e: string) => {
    handleChangeSelect(e);
  };

  const dataResult =
    data?.map((d) => ({
      value: d.value?.toString(),
      label: d.label,
    })) || [];

  return (
    // <Select
    //   showSearch
    //   className="w-full"
    //   size="large"
    //   value={value}
    //   placeholder={placeholder}
    //   style={{ minWidth: 280, ...style }}
    //   filterOption={false}
    //   virtual={false}
    //   onSearch={debounce(handleSearch, debounceSeconds || 300)}
    //   onChange={handleChange}
    //   // notFoundContent={<p className="p-2">Không tìm thấy</p>}
    //   options={data?.map((d) => ({
    //     value: d.value,
    //     label: d.text,
    //   }))}
    //   allowClear={allowClear}
    // />
    <Autocomplete
      value={value?.toString() ?? ""}
      onInputChange={debounce(handleSearch, debounceSeconds || 300)}
      onSelectionChange={(e) => {
        handleChange(e?.toString() || "");
      }}
      labelPlacement="inside"
      defaultItems={dataResult}
      allowsCustomValue={true}
      label={title || "Tìm kiếm"}
      // placeholder={placeholder}
      onKeyDown={(e: any) => e.continuePropagation()}
      className="max-w-2xl w-full"
    >
      {/* {(item) => (
        <AutocompleteItem key={item.value ?? ""} textValue={item?.value ?? ""}>
          {item.label}
        </AutocompleteItem>
      )} */}

      {dataResult.map((item) => (
        <AutocompleteItem key={item.value ?? ""} textValue={item?.value ?? ""}>
          {item.label}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
