import { ManagerSpecialist } from "@/components/admin-box";

export interface SpecialistAdminProps {}

export default function SpecialistAdminPage(props: SpecialistAdminProps) {
  return (
    <div className="box-white">
      <ManagerSpecialist />
    </div>
  );
}
