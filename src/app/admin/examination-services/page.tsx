import { ManagerExaminationService } from "@/components/admin-box/ManagerExaminationService";
import { ManagerHospitalService } from "@/components/admin-box/ManagerHospitalService";
import AdminServicePie from "@/components/chart/AdminServicePie";

export default function ExaminationServicesPage() {
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="box-white col-span-4">
        <AdminServicePie />
      </div>
      <div className="box-white col-span-8">
        <ManagerExaminationService />
      </div>
      <div className="box-white col-span-12">
        <ManagerHospitalService />
      </div>
    </div>
  );
}
