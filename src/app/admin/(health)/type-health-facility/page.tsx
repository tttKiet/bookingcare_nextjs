import { ManagerTypeHealthFacilites } from "@/components/admin-box";
import { HealthFacilitiesBox } from "@/components/admin-box";
import { TotalDashBoardHealthFacilitiesAdmin } from "@/components/common";

export interface HealthFacilitiesAdminProps {}

export default function TypeHealthFacilitiesAdminPage(
  props: HealthFacilitiesAdminProps
) {
  return (
    <div className="box-white">
      <ManagerTypeHealthFacilites />
    </div>
  );
}
