"use client";

import { MangerHealthExaminationScheduleForDoctor } from "@/components/admin-box/MangerHealthExaminationScheduleForDoctor";
import SchedulerDoctor from "@/components/common/calender/SchedulerDoctor";
import { Divider, Tab, Tabs } from "@nextui-org/react";

export default function HealthAxaminationSchedule() {
  return (
    <div className="box-white text-left">
      <Tabs color={"primary"} radius="sm" classNames={{ base: "text-left" }}>
        <Tab key="schedule" title="Xem trên lịch">
          <SchedulerDoctor />
        </Tab>

        <Tab key="manager" title="Quản lý lịch">
          <MangerHealthExaminationScheduleForDoctor />
        </Tab>
      </Tabs>
    </div>
  );
}
