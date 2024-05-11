"use client";

import { Pie } from "react-chartjs-2";
export interface IBookinGenderProps {}
const DATA_COUNT = 7;

import { API_CHART } from "@/api-services/constant-api";
import {
  ArcElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import useSWR from "swr";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);
ChartJS.register(ArcElement, Tooltip, Legend);

const labels = ["Hoạt động", "Tạm ngưng"];

export default function AdminServicePie(props: IBookinGenderProps) {
  const { data: resData } = useSWR<{
    serviceActive: number;
    serviceNonActive: number;
  }>(API_CHART + `?role=admin&page=service&index=1`);

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
        data: resData
          ? [resData?.serviceActive, resData?.serviceNonActive]
          : [],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.5)"],
      },
    ],
  };

  return (
    <div className=" h-full">
      <h4 className="text-[#2b2f32] mb-4 text-lg font-bold  text-left flex items-center gap-2 justify-between">
        <div className="flex-1">Thống kê hoạt động</div>
      </h4>
      <div className="flex items-center justify-center">
        <Pie data={data} height={340}></Pie>
      </div>
    </div>
  );
}
