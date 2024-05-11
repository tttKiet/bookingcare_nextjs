import { API_INDEX } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfile } from "@/models";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  BarElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useSWR from "swr";
import { Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

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

export interface IChartAccountProfileProps {}
const colors = [
  "rgba(54, 162, 235, 0.5)", // Màu xanh dương
  "rgba(255, 99, 132, 0.5)", // Màu đỏ
  "rgba(75, 192, 192, 0.5)", // Màu xanh lá cây
  "rgba(255, 159, 64, 0.5)", // Màu cam
  "rgba(153, 102, 255, 0.5)", // Màu tím
  "rgba(255, 102, 204, 0.5)", // Màu hồng
  "rgba(255, 206, 86, 0.5)", // Màu vàng
  "rgba(0, 0, 0, 0.5)", // Màu đen
  "rgba(255, 255, 255, 0.5)", // Màu trắng
  "rgba(128, 128, 128, 0.5)", // Màu xám
];
export default function ChartAccountProfile(props: IChartAccountProfileProps) {
  const { profile } = useAuth();
  const [date, setDate] = useState<string>("2024");

  const { data: index2 } = useSWR<{
    chart: {
      patientProfile: PatientProfile;
      data: number[];
    }[];
    max: {
      patientProfile: PatientProfile;
      bookingCount: number;
    };
  }>(`${API_INDEX}?page=profile&index=2&userId=${profile?.id}&year=` + date);

  const options: ChartOptions<"line"> = {
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
        suggestedMax: (index2?.max.bookingCount || 3) + 2,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  const data: ChartData<"line"> = {
    labels,
    datasets:
      index2?.chart?.map((p, index) => {
        return {
          label: p.patientProfile.fullName,
          data: p.data || [],
          backgroundColor: colors[index],
        };
      }) || [],
  };
  return (
    <div className="">
      <h4 className="text-[#2b2f32] text-lg font-bold  text-left flex items-center gap-2 justify-between">
        <div className="flex-1">
          Thống kê số lần đặt khám của bệnh nhân theo tháng
        </div>
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
        <Line height={340} options={options} data={data} />
      </div>
    </div>
  );
}
