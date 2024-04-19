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

export function getColorChipCheckUp(
  key: string | undefined
):
  | "success"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | undefined {
  if (key == "CU2") {
    return "primary";
  } else if (key == "CU3") {
    return "success";
  } else if (key == "CU4") {
    return "danger";
  } else {
    return "default";
  }
}

export function getColorChipHR(
  key: string | undefined
):
  | "success"
  | "warning"
  | "default"
  | "primary"
  | "secondary"
  | "danger"
  | undefined {
  if (key == "HR2") {
    return "primary";
  } else if (key == "HR3") {
    return "warning";
  } else if (key == "CU4") {
    return "danger";
  } else {
    return "default";
  }
}

export function textNomo(str: string | undefined): string {
  return (
    str
      ?.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D") || ""
  );
}
