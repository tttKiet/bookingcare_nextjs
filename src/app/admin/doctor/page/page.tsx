import { ManagerChart } from "@/components/admin-box/manager.chart";
import { ManagerAccountStaff } from "@/components/admin/ManagerAccountStaff";
import { ManagerDoctoMarkdown } from "@/components/admin/ManagerDoctoMarkdown";

export interface IChartProps {}

export default function DoctorPage(props: IChartProps) {
  return (
    <div>
      <ManagerDoctoMarkdown />
    </div>
  );
}
