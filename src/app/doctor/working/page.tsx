"use client";

import { API_WORKING } from "@/api-services/constant-api";
import WorkingStaff from "@/components/common/WorkingStaff";
import { Working } from "@/models";
import { ResDataPaginations } from "@/types";
import { useMemo } from "react";
import useSWR from "swr";

export default function WorkingPage() {
  return (
    <div className="box-white">
      <WorkingStaff />
    </div>
  );
}
