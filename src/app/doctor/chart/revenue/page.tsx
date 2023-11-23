"use client";

import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import moment from "moment";
import useSWR from "swr";
import { API_DOCTOR_CHART_REVENUE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import dayjs from "dayjs";
import { DatePicker } from "antd";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
export interface IRevenueProps {}
export default function Revenue(props: IRevenueProps) {
  const { profile } = useAuth();
  const [year, setYear] = useState("2023");
  const { data: revenueData } = useSWR<number[]>(
    `${API_DOCTOR_CHART_REVENUE}?year=${year}&staffId=${profile?.id}`
  );
  const data: ChartData<"bar"> = {
    labels: [
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
    ],
    datasets: [
      {
        type: "bar",
        label: "Doanh thu",
        data: revenueData || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Biểu đồ hiển thị doanh thu theo năm ${moment(
          new Date(year)
        ).format("YYYY")}`,
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.dataset.label}: ${item.formattedValue} vnđ`,
        },
      },
    },
    responsive: true,
    scales: {
      y: {
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value) {
            return value + " vnđ";
          },
        },
      },
    },
  };
  function handleChangeYear(value: dayjs.Dayjs | null, dateString: string) {
    setYear(dateString);
  }
  return (
    <div className="px-4 py-8 min-h-[400px]">
      <div className="flex items-center my-2 gap-3 ">
        <span>Năm: </span>
        <DatePicker
          defaultValue={dayjs(new Date())}
          onChange={handleChangeYear}
          picker="year"
        />
      </div>
      <div className="mx-auto max-w-[976px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
