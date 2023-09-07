import { ManagerTypeHealthFacilites } from "@/components/admin";
import { HealthFacilitiesBox } from "@/components/admin-box";
import { TotalDashBoardHealthFacilitiesAdmin } from "@/components/common";
import * as React from "react";

export interface HealthFacilitiesAdminProps {}

export default function TypeHealthFacilitiesAdminPage(
  props: HealthFacilitiesAdminProps
) {
  return (
    <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
      <ManagerTypeHealthFacilites />
    </div>
  );
}
