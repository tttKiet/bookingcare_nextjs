import {
  Code,
  HealthExaminationSchedule,
  ScheduleAvailable,
  TimeSlot,
} from "@/models";
import moment from "moment";

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
export interface TimeSlotCode {
  Morning: Code[];
  Afternoon: Code[];
}
export function sortTimeSlotsCode(arr: Code[]) {
  if (!arr) {
    return { Morning: [], Afternoon: [] };
  }
  const result: TimeSlotCode = {
    Morning: [],
    Afternoon: [],
  };

  arr.forEach((h: Code) => {
    const time = parseInt(h.value.split("h")[0]);
    if (time >= 7 && time < 12) {
      result["Morning"].push(h);
    } else if ((time >= 12 && time <= 17) || (time >= 1 && time <= 5)) {
      result["Afternoon"].push(h);
    }
  });
  return result;
}
export interface TimeSlotExaminationSchedule {
  Morning: HealthExaminationSchedule[];
  Afternoon: HealthExaminationSchedule[];
}
export function sortTimeSlotsHealthExaminationSchedule(
  arr: HealthExaminationSchedule[]
) {
  if (!arr) {
    return { Morning: [], Afternoon: [] };
  }
  const result: TimeSlotExaminationSchedule = {
    Morning: [],
    Afternoon: [],
  };

  arr.forEach((h: HealthExaminationSchedule) => {
    const time = parseInt(h.TimeCode.value.split("h")[0]);
    if (time >= 7 && time < 12) {
      result["Morning"].push(h);
    } else if ((time >= 12 && time <= 17) || (time >= 1 && time <= 5)) {
      result["Afternoon"].push(h);
    }
  });

  result.Afternoon.sort(
    (a: HealthExaminationSchedule, b: HealthExaminationSchedule) => {
      const timeA = parseInt(a.TimeCode.value.split("h")[0]);
      const timeB = parseInt(b.TimeCode.value.split("h")[0]);
      // Nếu giờ khác nhau, sắp xếp dựa trên giờ

      if (timeA !== timeB) {
        return timeA - timeB;
      }

      // Nếu cùng giờ, sắp xếp dựa trên phút
      const minuteA = parseInt(a.TimeCode.value.split("h")[1]);
      const minuteB = parseInt(b.TimeCode.value.split("h")[1]);

      return minuteA - minuteB;
    }
  );

  result.Morning.sort(
    (a: HealthExaminationSchedule, b: HealthExaminationSchedule) => {
      const timeA = parseInt(a.TimeCode.value.split("h")[0]);
      const timeB = parseInt(b.TimeCode.value.split("h")[0]);
      // Nếu giờ khác nhau, sắp xếp dựa trên giờ

      if (timeA !== timeB) {
        return timeA - timeB;
      }

      // Nếu cùng giờ, sắp xếp dựa trên phút
      const minuteA = parseInt(a.TimeCode.value.split("h")[1]);
      const minuteB = parseInt(b.TimeCode.value.split("h")[1]);

      return minuteA - minuteB;
    }
  );
  return result;
}

export interface HealthExaminationScheduleAPM
  extends HealthExaminationSchedule {
  valueApm: string;
}

export function sortCodesByValue(arr: HealthExaminationSchedule[]) {
  // Sử dụng phương thức sort để sắp xếp mảng theo giá trị của trường value
  arr.sort((a, b) => {
    // Chuyển đổi giờ thành số để so sánh
    const timeA = parseInt(a.TimeCode.value.split("h")[0]);
    const timeB = parseInt(b.TimeCode.value.split("h")[0]);
    // Nếu giờ khác nhau, sắp xếp dựa trên giờ
    const aAm = timeA >= 7 && timeA < 12;
    const bPm = timeB > 12;

    if (aAm && bPm) {
      return -1;
    } else if (!aAm && !bPm) {
      return 1;
    }

    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // Nếu cùng giờ, sắp xếp dựa trên phút
    const minuteA = parseInt(a.TimeCode.value.split("h")[1]);
    const minuteB = parseInt(b.TimeCode.value.split("h")[1]);

    return minuteA - minuteB;
  });
  const result: HealthExaminationScheduleAPM[] = [];

  arr.forEach((h: HealthExaminationSchedule) => {
    const time = parseInt(h.TimeCode.value.split("h")[0]);
    if (time >= 7 && time < 12) {
      result.push({
        ...h,
        valueApm: h.TimeCode.value + " am",
      });
    } else if ((time >= 12 && time <= 17) || (time >= 1 && time <= 5)) {
      result.push({
        ...h,
        valueApm: h.TimeCode.value + " pm",
      });
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
    return "success";
  } else if (key == "CU3") {
    return "warning";
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
  console.log("keykeykeykeykey", key);
  if (key == "HR2") {
    return "primary";
  } else if (key == "HR3") {
    return "warning";
  } else if (key == "HR4") {
    return "success";
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

export function filterNonEmptyValues(obj: any) {
  const filteredObject: any = {};
  Object.keys(obj).forEach((key: any) => {
    if (obj[key] !== "" && obj[key] !== undefined) {
      filteredObject[key] = obj[key];
    }
  });
  return filteredObject;
}

export function calculateAge(birthdate: string | Date) {
  const birthDate = moment(birthdate);
  const now = moment();
  return now.diff(birthDate, "years");
}
