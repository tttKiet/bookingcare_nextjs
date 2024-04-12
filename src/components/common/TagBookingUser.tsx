import { ColorBox } from "../box";
import useSWR from "swr";
import { ResDataPaginations } from "@/types";
import { BookingForUser, PatientProfile } from "@/models";
import { API_BOOKING, API_PATIENT_PROFILE } from "@/api-services/constant-api";
import { useAuth } from "@/hooks";
import { PatientProfileItem } from "./PatientProfileItem";
import { Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { userApi } from "@/api-services";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import Link from "next/link";
import { Accordion, AccordionItem, Avatar } from "@nextui-org/react";
import { randomInt } from "crypto";
import { data } from "autoprefixer";
import moment from "moment";
import { BiUserPin } from "react-icons/bi";
import { BsTelephone } from "react-icons/bs";
import { HiOutlineMail } from "react-icons/hi";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import { BookingUserItem } from "./BookingUserItem";
import { CiUser } from "react-icons/ci";
import DropDownBookingBill from "./DropDownBookingBill";
const { confirm } = Modal;

export interface TagBookingUserProps {
  selectedKey: string;
}

export function TagBookingUser({ selectedKey }: TagBookingUserProps) {
  const { profile } = useAuth();

  const { data: responsePatientProfile, mutate: mutatePatientProfile } = useSWR<
    ResDataPaginations<BookingForUser>
  >(`${API_BOOKING}?status=${selectedKey}`, {
    revalidateOnMount: true,
    dedupingInterval: 5000,
  });

  return (
    <div>
      <div className=" ">
        <Accordion variant="splitted">
          {responsePatientProfile?.rows.map((p: BookingForUser) => (
            <AccordionItem
              key={p.id}
              title={
                <div className="flex items-center gap-2">
                  <div className="font-medium flex items-center">
                    <div className="flex items-center justify-center relative top-[-1px] mr-2">
                      <CiUser size={18} />
                    </div>
                    <span> {p.PatientProfile.fullName}</span>
                  </div>
                </div>
              }
              classNames={{ content: "px-8" }}
              subtitle={
                <div className="flex items-center gap-4 ">
                  <div>
                    {`Ngày tạo lịch: ${moment(p.createdAt).format(
                      "L"
                    )} | Ngày khám: ${moment(
                      p.HealthExaminationSchedule.date
                    ).format("L")}`}
                  </div>

                  <DropDownBookingBill bookingId={p.id} />
                </div>
              }
            >
              <BookingUserItem data={p} onClickDelete={() => {}} />
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
