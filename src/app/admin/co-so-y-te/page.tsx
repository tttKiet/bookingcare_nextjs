import { ManagerTypeHealthFacilites } from "@/components/admin";
import { TotalDashBoardHealthFacilitiesAdmin } from "@/components/common";
import * as React from "react";

export interface HealthFacilitiesAdminProps {}

export default function HealthFacilitiesAdmin(
  props: HealthFacilitiesAdminProps
) {
  return (
    <div>
      <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
        <TotalDashBoardHealthFacilitiesAdmin />
        <ManagerTypeHealthFacilites />
        <ManagerTypeHealthFacilites />
        <ManagerTypeHealthFacilites />
        <ManagerTypeHealthFacilites />
      </div>
    </div>
  );
}
