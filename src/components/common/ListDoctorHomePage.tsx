"use client";

import useSWR from "swr";
import TitleText from "./TitleText";
import { API_ACCOUNT_STAFF } from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { Staff } from "@/models";

const images = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

export default function ListDoctorHomePage() {
  const { data: doctors } = useSWR<ResDataPaginations<Staff>>(
    `${API_ACCOUNT_STAFF}?limit=6`
  );

  return (
    <div className="container mx-auto">
      <TitleText
        title="Bác sĩ nổi bật"
        bgTitle="Excellent doctor"
        desc="Các bác sỉ có nhiều thành tích trong năm 2023 - Giàu kinh nghiệm"
      />
      <ul
        role="list"
        className=" grid md:grid-cols-2 grid-cols-1 gap-8  md:gap-32 md:gap-y-7"
      >
        {doctors?.rows.map((person: Staff, i: number) => (
          <li
            key={person.id}
            className="rounded-lg px-6 py-4 bg-white shadow-md"
          >
            <div className="flex items-center gap-x-6">
              <img className="h-16 w-16 rounded-full" src={images[i]} alt="" />
              <div className="flex-1">
                <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                  {person.fullName}
                </h3>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-sm font-semibold leading-6 text-indigo-600">
                    {person.AcademicDegree.name}
                  </p>
                  <p className="text-sm font-semibold leading-6 text-gray-600">
                    {person.Specialist.name}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
