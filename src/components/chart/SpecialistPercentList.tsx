import { Bar, Pie } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import { faker } from "@faker-js/faker";
import useSWR from "swr";
import { API_CHART } from "@/api-services/constant-api";
import { ChartPageHomeIndex2, ChartPageHomeIndex3, Staff } from "@/models";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
const colors = [
  "#FF33FF",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function SpecialistPercentList(props: IBookinGenderProps) {
  const { data: resData } = useSWR<ChartPageHomeIndex3[]>(
    API_CHART + "?role=admin&page=home&index=3"
  );

  const data = resData?.sort((a, b) => {
    return b.percent - a.percent;
  });

  return (
    <div className="box-white min-h-[360px]">
      <h4 className="text-[#2b2f32] text-lg font-bold text-left flex items-center gap-2 justify-between">
        <div className="flex-1">Các khoa hàng đầu</div>
      </h4>
      <div className="mt-3">
        {data?.slice(0, 3)?.map((k) => (
          <div key={k.specialist.id} className="text-left mb-2">
            <h4 className="text-[#1b3c74] text-lg font-medium">
              {k.specialist.name}
            </h4>
            <div className="font-medium ">{k.percent}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
