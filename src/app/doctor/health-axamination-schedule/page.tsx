import { ManagerHealthExamSchedule } from "@/components/admin-box";
import * as React from "react";

export default function HealthAxaminationSchedule() {
  return (
    <div className="p-4">
      <ManagerHealthExamSchedule permission="doctor" />
    </div>
  );
}
