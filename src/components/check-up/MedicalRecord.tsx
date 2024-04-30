import dynamic from "next/dynamic";
import { LoadingPage } from "../spinners";
import { API_ADMIN_MANAGER_ADMIN_HEALTH } from "@/api-services/constant-api";
import { AcademicDegree, ResManagerAdmin } from "@/models";
import { ResDataPaginations } from "@/types";
import axios from "axios";
import useSWR, { BareFetcher } from "swr";

export interface IMedicalRecordProps {}
const MediCalRecordUser = dynamic(() => import("./MediCalRecordUser"), {
  loading: () => <LoadingPage />,
  ssr: false,
});

export default function MedicalRecord(props: IMedicalRecordProps) {
  // Fetch

  return (
    <div>
      <MediCalRecordUser />
    </div>
  );
}
