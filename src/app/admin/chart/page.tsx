import { ManagerChart } from "@/components/admin-box/manager.chart";
import * as React from "react";

export interface IChartProps {}

export default function Chart(props: IChartProps) {
  return (
    <div>
      <ManagerChart />
    </div>
  );
}
