import { ManagerChart } from "@/components/admin-box/manager.chart";
import { ManagerPatientAdmin } from "@/components/admin-box/ManagerPatientAdmin";
import { ManagerAccountStaff } from "@/components/admin/ManagerAccountStaff";
import { ManagerDoctoMarkdown } from "@/components/admin/ManagerDoctoMarkdown";

export interface IChartProps {}

export default function PatientPage(props: IChartProps) {
  return (
    <div className="box-white">
      <ManagerPatientAdmin />
    </div>
  );
}
