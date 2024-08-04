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

export default function SpecialistPercent(props: IBookinGenderProps) {
  const [date, setDate] = useState<string>("2024");
  const { data: resData } = useSWR<ChartPageHomeIndex3[]>(
    API_CHART + "?role=admin&page=home&index=3"
  );

  const data: ChartData<"pie"> = {
    labels: resData?.map((r) => r.specialist.name.toString()) || [],
    datasets: [
      {
        label: "Chuyên khoa",
        data: resData?.map((r) => r.count) || [],
        backgroundColor: colors,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
      },
      subtitle: {
        color: "white",
      },
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map((data: any) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed(2) + "%";
          return percentage;
        },
        color: "#fff",
      },
    },
  };

  return (
    <div className="box-white min-h-[400px]">
      <h4 className="text-[#2b2f32] text-lg font-bold text-left flex items-center gap-2 justify-between">
        <div className="flex-1">Tần suất khám bệnh theo chuyên khoa</div>
      </h4>
      <div>
        <Pie data={data} height={300} options={options}></Pie>
      </div>
    </div>
  );
}
