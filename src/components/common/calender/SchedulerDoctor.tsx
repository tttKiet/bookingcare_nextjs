"use client";

import {
  API_ACCOUNT_STAFF_DOCTOR_WORKING,
  API_DOCTOR_SCHEDULE_ALL,
} from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import {
  HealthExaminationSchedule,
  HealthExaminationScheduleResAll,
  Working,
} from "@/models";
import { ResDataPaginations } from "@/types";
import {
  HealthExaminationScheduleAPM,
  sortCodesByValue,
  sortTimeSlotsHealthExaminationSchedule,
} from "@/untils/common";
import moment from "moment";
import { useMemo } from "react";
import { Badge, Calendar, Popover, Whisper } from "rsuite";
import useSWR from "swr";
export interface IScheduleDoctorProps {}
function getTodoList(date: Date) {
  const day = date.getDate();

  switch (day) {
    case 10:
      return [
        { time: "10:30 am", title: "Meeting" },
        { time: "12:00 pm", title: "Lunch" },
      ];
    case 15:
      return [
        { time: "09:30 pm", title: "Meeting" },
        { time: "12:30 pm", title: "Client " },
        { time: "02:00 pm", title: "Product" },
        { time: "05:00 pm", title: "Product" },
        { time: "06:30 pm", title: "Reporting" },
        { time: "10:00 pm", title: "Going home to walk the dog" },
      ];
    default:
      return [];
  }
}
export default function ScheduleDoctor(props: IScheduleDoctorProps) {
  const { profile } = useAuth();

  const { data: doctor, isLoading: loadingLoadDoctorWorking } = useSWR<
    ResDataPaginations<Working>
  >(
    `${API_ACCOUNT_STAFF_DOCTOR_WORKING}?doctorId=${
      profile?.id?.toString() || ""
    }`,
    {
      revalidateOnMount: true,
    }
  );

  const workingDoctor: Working | undefined = useMemo(() => {
    return doctor?.rows?.[0];
  }, [doctor]);

  const {
    mutate: mutateSchedule,
    data: responseSchedule,
    error,
    isLoading: isLoadingFetching,
  } = useSWR<ResDataPaginations<HealthExaminationScheduleResAll>>(
    `${API_DOCTOR_SCHEDULE_ALL}?workingId=${workingDoctor?.id}&limit=1000&offset=0`
  );

  function cellClassName(date: Date) {
    const momentDate = moment(new Date(date?.toString() || "")).format(
      "MM[/]DD[/]YYYY"
    );
    const schedule: HealthExaminationScheduleResAll | null =
      responseSchedule?.rows.find(
        (r: HealthExaminationScheduleResAll) => r.date == momentDate
      );
    return schedule?.date == momentDate ? "bg-gray-100" : undefined;
  }

  function renderCell(date: Date) {
    // const list = getTodoList(date);

    const momentDate = moment(new Date(date?.toString() || "")).format(
      "MM[/]DD[/]YYYY"
    );
    const schedule: HealthExaminationScheduleResAll | null =
      responseSchedule?.rows.find(
        (r: HealthExaminationScheduleResAll) => r.date == momentDate
      );
    // const list = schedule?.schedule;

    const list = sortCodesByValue(schedule?.schedule || []);

    const displayListCode = list?.filter((item, index) => index < 2) || [];

    if (list?.length) {
      const moreCount = list?.length - displayListCode.length;
      const moreItem = (
        <li className="flex items-center w-full ">
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    {sortTimeSlotsHealthExaminationSchedule(list).Morning.map(
                      (item: HealthExaminationSchedule, index: number) => (
                        <p key={index}>
                          <b>{item?.TimeCode.value} am</b>
                        </p>
                      )
                    )}
                  </div>
                  <div>
                    {sortTimeSlotsHealthExaminationSchedule(list).Afternoon.map(
                      (item: HealthExaminationSchedule, index: number) => (
                        <p key={index}>
                          <b>{item?.TimeCode.value} pm</b>
                        </p>
                      )
                    )}
                  </div>
                </div>
              </Popover>
            }
          >
            <a className="flex-1">xem thêm ({moreCount}) </a>
          </Whisper>
        </li>
      );

      return (
        <ul className="flex flex-col gap-0 items-start">
          {displayListCode.map(
            (item: HealthExaminationScheduleAPM, index: number) => (
              <li key={index}>
                <Badge /> <b>{item?.valueApm}</b>
              </li>
            )
          )}
          {moreCount ? moreItem : null}
        </ul>
      );
    }

    return null;
  }

  return (
    <div>
      <Calendar
        cellClassName={cellClassName}
        bordered
        renderCell={renderCell}
      />
    </div>
  );
}
