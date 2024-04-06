import {
  HealthExaminationSchedule,
  ScheduleAvailable,
  TimeSlot,
} from "@/models";

export function sortTimeSlots(arr: ScheduleAvailable[]) {
  const result: TimeSlot = {
    Morning: [],
    Afternoon: [],
  };

  arr.forEach((h: ScheduleAvailable) => {
    const time = parseInt(h.TimeCode.value.split("h")[0]);
    if (time >= 7 && time < 12) {
      result["Morning"].push(h);
    } else if ((time >= 12 && time <= 17) || (time >= 1 && time <= 5)) {
      result["Afternoon"].push(h);
    }
  });
  return result;
}
