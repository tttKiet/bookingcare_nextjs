import { Bar, Line, Pie } from "react-chartjs-2";
export interface IBookinGenderProps {}
const DATA_COUNT = 7;

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { faker } from "@faker-js/faker";
import useSWR from "swr";
import { API_CHART } from "@/api-services/constant-api";
import { ChartPageHomeIndex2, Staff } from "@/models";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from "@/hooks";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);
ChartJS.register(ArcElement, Tooltip, Legend);

const labels = ["Nam", "Nữ"];

export default function BookingDoctorGender(props: IBookinGenderProps) {
  const { profile } = useAuth();

  const { data: resData } = useSWR<{
    bookingMale: number;
    bookingFeMale: number;
  }>(API_CHART + `?role=doctor&page=home&index=3&staffId=${profile?.id}`);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
    },
  };
  const data: ChartData<"pie"> = {
    labels,
    datasets: [
      {
        data: resData ? [resData?.bookingMale, resData?.bookingFeMale] : [],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.5)"],
      },
    ],
  };

  return (
    <div className="box-white  h-full">
      <h4 className="text-[#2b2f32] mb-4 text-lg font-bold  text-left flex items-center gap-2 justify-between">
        <div className="flex-1">Bệnh nhân theo giới tính</div>
      </h4>
      <div>
        <Pie data={data} height={340}></Pie>
      </div>
    </div>
  );
}
