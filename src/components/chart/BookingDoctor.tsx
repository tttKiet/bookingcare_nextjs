import { Bar, Line } from "react-chartjs-2";
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
} from "chart.js";
import { faker } from "@faker-js/faker";
import useSWR from "swr";
import { API_CHART } from "@/api-services/constant-api";
import { ChartPageHomeIndex2, Staff } from "@/models";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from "@/hooks";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const labels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

export default function BookingDoctor(props: IBookinGenderProps) {
  const [date, setDate] = useState<string>("2024");
  const { profile } = useAuth();

  const { data: resData } = useSWR<{
    data: number[];
  }>(
    API_CHART +
      `?role=doctor&page=home&index=2&staffId=${profile?.id}&year=` +
      date
  );

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

    scales: {
      y: {
        suggestedMax: Math.max(...(resData?.data || [400])) + 100000,
        beginAtZero: true,

        // type: "linear",
        // reverse: false,
        ticks: {
          callback: function (value) {
            // return value;
            return Number(value).toLocaleString() + "đ";
          },
        },
      },
    },
  };
  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: resData?.data || [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="box-white  h-full">
      <h4 className="text-[#2b2f32] text-lg font-bold  text-left flex items-start gap-2 justify-between">
        <div className="flex-1">Doanh thu của bạn theo tháng</div>
        <Select
          classNames={{}}
          color="primary"
          aria-label="12"
          variant="bordered"
          selectionMode="single"
          defaultSelectedKeys={["2024"]}
          selectedKeys={[date]}
          disallowEmptySelection
          size="sm"
          onChange={(e) => setDate(e.target.value)}
          className="max-w-[90px] inbar-block"
        >
          <SelectItem key={"2024"} value={"2024"}>
            2024
          </SelectItem>
          <SelectItem key={"2023"} value={"2023"}>
            2023
          </SelectItem>
          <SelectItem key={"2022"} value={"2022"}>
            2022
          </SelectItem>
          <SelectItem key={"2021"} value={"2021"}>
            2021
          </SelectItem>
        </Select>
      </h4>
      <div>
        <Line options={options} data={data} height={340}></Line>
      </div>
    </div>
  );
}
