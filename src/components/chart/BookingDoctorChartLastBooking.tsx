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
import { Booking, ChartPageHomeIndex2, Staff } from "@/models";
import {
  Chip,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from "@/hooks";
import moment from "moment";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);
ChartJS.register(ArcElement, Tooltip, Legend);

const labels = ["Nam", "Nữ"];

export default function BookingDoctorChartLastBooking(
  props: IBookinGenderProps
) {
  const { profile } = useAuth();

  const { data: resData } = useSWR<{
    patient: {
      bookingLast: Booking;
      count: number;
    }[];
    keyWordPatient: string[];
  }>(API_CHART + `?role=doctor&page=home&index=4&staffId=${profile?.id}`);

  return (
    <>
      <div className="box-white col-span-3">
        <h4 className="text-[#2b2f32] mb-4 text-lg font-bold  text-left flex items-center gap-2 justify-between">
          <div className="flex-1">Triệu chứng gần đây</div>
        </h4>
        <div className="flex flex-wrap gap-3">
          {resData?.keyWordPatient.slice(0, 5).map((t: string) => (
            <Chip key={t} size="sm" color="warning" variant="flat" radius="sm">
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="box-white col-span-9 h-full">
        <h4 className="text-[#2b2f32] mb-4 text-lg font-bold  text-left flex items-center gap-2 justify-between">
          <div className="flex-1">Danh sách bệnh nhân của bạn</div>
        </h4>
        <div>
          {resData?.patient && resData?.patient.length > 0 ? (
            <Table isStriped removeWrapper>
              <TableHeader>
                <TableColumn>Thứ tứ</TableColumn>
                <TableColumn>Tên bệnh nhân</TableColumn>
                <TableColumn>Số lần khám</TableColumn>
                <TableColumn>Lần khám gần nhất</TableColumn>
              </TableHeader>
              <TableBody>
                {resData?.patient.map((r, index) => (
                  <TableRow key={r?.bookingLast?.id}>
                    <TableCell className="text-left font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {r?.bookingLast?.PatientProfile?.fullName}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {r?.count}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      <span>
                        {moment(
                          r?.bookingLast?.HealthExaminationSchedule?.date
                        ).format("L")}{" "}
                        <span className="px-2">|</span>{" "}
                        <Chip
                          radius="sm"
                          color="primary"
                          variant="flat"
                          size="sm"
                        >
                          {
                            r?.bookingLast?.HealthExaminationSchedule?.TimeCode
                              .value
                          }
                        </Chip>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="font-medium">Chưa có bệnh nhân gần đây!</div>
          )}
        </div>
      </div>
    </>
  );
}
