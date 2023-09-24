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
import * as React from "react";
import useSWR, { BareFetcher } from "swr";
export interface SelectSearchFieldProps {
  placeholder: string;
  style?: React.CSSProperties;
  debounceSeconds?: number;
  value: string | null | undefined;
  data: SelectProps["options"];
  handleSearchSelect: (value: string) => void;
  handleChangeSelect: (value: string) => void;
}

export function SelectSearchField({
  placeholder,
  style,
  debounceSeconds,
  data,
  handleSearchSelect,
  handleChangeSelect,
  value,
}: SelectSearchFieldProps) {
  const handleSearch = (newValue: string) => {
    handleSearchSelect(newValue);
  };

  const handleChange = (newValue: string) => {
    handleChangeSelect(newValue);
  };
  return (
    <Select
      showSearch
      size="large"
      value={value}
      placeholder={placeholder}
      style={{ minWidth: 280, ...style }}
      defaultActiveFirstOption={false}
      suffixIcon={null}
      filterOption={false}
      virtual={false}
      onSearch={debounce(handleSearch, debounceSeconds || 300)}
      onChange={handleChange}
      notFoundContent={<p>Không tìm thấy</p>}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  );
}
