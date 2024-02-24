import { ManagerHealthExamSchedule } from "@/components/admin-box";

export default function HealthAxaminationSchedule() {
  return (
    <div className="p-4">
      <ManagerHealthExamSchedule permission="doctor" />
    </div>
  );
}
