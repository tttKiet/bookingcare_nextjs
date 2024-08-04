import { Bar } from "react-chartjs-2";
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
} from "chart.js";
import { faker } from "@faker-js/faker";
import useSWR from "swr";
import { API_CHART } from "@/api-services/constant-api";
import { ChartPageHomeIndex2, Staff } from "@/models";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

const options: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: undefined,

    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
  },

  scales: {
    y: {
      suggestedMax: 4,
      beginAtZero: true,

      // type: "linear",
      // reverse: false,
      ticks: {
        // Include a dollar sign in the ticks
        // callback: function (value) {
        //   // return value;
        //   console.log("val;ue", value);
        //   return Number(value).toString();
        // },
        stepSize: 1,
      },
    },
  },
};

export default function BookinGender(props: IBookinGenderProps) {
  const [date, setDate] = useState<string>("2024");
  const { data: resData } = useSWR<ChartPageHomeIndex2>(
    API_CHART + "?role=admin&page=home&index=2&year=" + date
  );

  const data: ChartData<"bar"> = {
    labels,
    datasets: [
      {
        label: "Nam",
        data: resData?.male || [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Nữ",
        data: resData?.female || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="box-white min-h-[400px] ">
      <h4 className="text-[#2b2f32] text-lg font-bold  text-left flex items-center gap-2 justify-between">
        <div className="flex-1">Số lịch hẹn của bệnh nhân theo giới tính</div>
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
          className="max-w-[90px] inline-block"
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
        <Bar options={options} data={data} height={240}></Bar>
      </div>
    </div>
  );
}
