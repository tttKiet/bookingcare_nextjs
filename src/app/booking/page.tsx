"use client";

import { userApi } from "@/api-services";
import { API_HEALTH_FACILITIES } from "@/api-services/constant-api";
import { paymentApi } from "@/api-services/payment-api";
import { ColorBox } from "@/components/box";
import {
  ChooseDoctor,
  ChooseSchedule,
  ComfirmInformation,
} from "@/components/common/step-boking";
import { ChoosePatientProfile } from "@/components/common/step-boking/ChoosePatientProfile";
import { PaymentInformation } from "@/components/common/step-boking/PaymentInformation";
import StepBookings from "@/components/steps/steps-booking,";
import { useAuth, useDisPlay } from "@/hooks";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import {
  HealthExaminationSchedule,
  HealthFacility,
  PatientProfile,
  WorkRoom,
} from "@/models";
import { ResDataPaginations } from "@/types";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { StepProps, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiLocationOn, CiUser } from "react-icons/ci";
import { FcPhoneAndroid } from "react-icons/fc";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { toast } from "react-toastify";
import useSWR from "swr";
export interface IAboutPageProps {}

export default function Booking(props: IAboutPageProps) {
  const refContent = useRef(null);
  const searchParams = useSearchParams();
  const [current, setCurrent] = useState<number>(0);
  const healthFacilityId = searchParams.get("healthFacilityId");
  const router = useRouter();
  const { profile } = useAuth();

  // Data booking
  const [doctorChoose, setDoctorChoose] = useState<WorkRoom | null>(null);
  const [descStatusPatient, setDescStatusPatient] = useState<string>("");
  const [healthExaminationSchedule, setHealthExaminationSchedule] =
    useState<Partial<HealthExaminationSchedule> | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(
    null
  );
  const { scrollTo } = useDisPlay();
  function stepNext(step: number, value?: any) {
    scrollTo(refContent?.current, {
      top: 168,
    });

    if (step == 1) {
      setDoctorChoose(value);
      setCurrent(1);
      setInfoCheckupItems((prev) => {
        const existed = prev.find((p: any) => p.key === "1");

        const newArray = [...prev];
        const item = {
          key: "1",
          title: "Bác sỉ",
          description: (
            <div>
              <h5>{value.Working.Staff.fullName}</h5>
              <div className="mt-1">
                <span> {value.Working.Staff.AcademicDegree.name}</span>{" "}
                <span className="px-2  text-pink-500">|</span>
                <span>
                  Khoa
                  <span> {value.Working.Staff.Specialist.name}</span>
                </span>
              </div>
              <div className=" mt-1 ">
                Giá khám:{" "}
                <span className="px-2 bg-blue-500 text-white rounded-lg">
                  {value.checkUpPrice.toLocaleString()} vnđ
                </span>
              </div>
            </div>
          ),
        };

        if (existed) {
          newArray.splice(1, 1, item);
          return newArray;
        } else {
          return [...newArray, item];
        }
      });
    } else if (step == 2) {
      setHealthExaminationSchedule(value);
      setCurrent(2);
      setInfoCheckupItems((prev) => {
        const existed = prev.find((p: any) => p.key === "2");

        const newArray = [...prev];
        const item = {
          key: "2",
          title: "Thời gian",
          description: (
            <div>
              <div className=" flex items-center gap-2">
                <span>Ngày khám: </span>
                <span className="text-blue-500">
                  {moment(value.date).format("L")}{" "}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span>Khung giờ: </span>
                <span className="px-2 border rounded-xl border-dashed border-blue-500">
                  {value?.TimeCode?.value}
                </span>
              </div>
            </div>
          ),
        };

        if (existed) {
          newArray.splice(2, 1, item);
          return newArray;
        } else {
          return [...newArray, item];
        }
      });
    } else if (step == 3) {
      setCurrent(3);
      setPatientProfile(value);
      setDescStatusPatient(value.descStatusPatient);
    } else if (step == 4) {
      setCurrent(4);
    }
  }

  function stepPrev() {
    scrollTo(refContent?.current, {
      top: 168,
    });

    setCurrent((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else return prev;
    });
  }

  // Check effect of health facility
  const { data: healthFacility } = useSWR<ResDataPaginations<HealthFacility>>(
    `${API_HEALTH_FACILITIES}?id=${healthFacilityId}`,
    {
      dedupingInterval: 6000,
    }
  );
  // const { data: doctorInfo } = useSWR<Staff>(
  //   `${API_ACCOUNT_STAFF_DOCTOR_BY_ID}?id=${doctorChoose?.staffId || ""}`,
  //   {
  //     dedupingInterval: 36000,
  //   }
  // );

  const tabItems: any[] = useMemo(() => {
    return [
      {
        label: `Cơ sở y tế`,
        key: "0",
        children: (
          <div className="flex items-center justify-center ">
            <Link className="text-blue-600" href="/health-facility">
              Vui lòng chọn cơ sở khám bệnh
            </Link>
          </div>
        ),
      },
      {
        label: `Chọn bác sỉ`,
        key: "1",
        children: (
          <ChooseDoctor
            next={stepNext}
            healthFacilityId={healthFacilityId || ""}
          />
        ),
      },
      {
        label: `Chọn thời gian khám`,
        key: "2",
        children: (
          <ChooseSchedule
            next={stepNext}
            previous={stepPrev}
            staffId={doctorChoose?.Working.staffId || ""}
          />
        ),
      },
      {
        label: `Chọn hồ sơ bệnh nhân`,
        key: "3",
        children: <ChoosePatientProfile next={stepNext} previous={stepPrev} />,
      },
    ];
  }, [doctorChoose?.Working.staffId]);

  // function onChangeSteps(value: number) {
  //   console.log(value);
  //   setCurrent(value);
  // }

  async function handleConfirmSuccess({
    paymentType,
  }: {
    paymentType: string;
  }): Promise<void> {
    try {
      const res = await paymentApi.vnpayCreateUrl({
        descriptionDisease: descStatusPatient,
        healthExaminationScheduleId: healthExaminationSchedule?.id || "",
        patientProfileId: patientProfile?.id || "",
        paymentType: paymentType,
      });
      console.log("res", res);
      if (res.statusCode === 0 || res.statusCode === 200) {
        router.push(res.data?.url!);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMsg = err.response.data.msg;
          toast.error(errorMsg);
        } else {
          toast.error("Lỗi không có phản hồi từ server");
        }
      } else {
        const errorWithMsg = err as { msg?: string };
        const errorMsg = errorWithMsg.msg || "Lỗi không xác định";
        toast.error(errorMsg);
      }
    }
  }

  const [infoCheckupItems, setInfoCheckupItems] = useState<StepProps[]>([
    {
      title: "Cơ sở y tế",
      description: "Chưa chọn",
    },
  ]);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    useGetAddress({
      wardCode: patientProfile?.addressCode[0] || "",
      districtCode: patientProfile?.addressCode[1] || "",
      provinceCode: patientProfile?.addressCode[2] || "",
    })
      .then((ob) => setAddress(ob.address))
      .catch((e) => "");
  }, [
    patientProfile?.addressCode[0],
    patientProfile?.addressCode[1],
    patientProfile?.addressCode[2],
  ]);

  useEffect(() => {
    if (healthFacility) {
      setInfoCheckupItems(() => {
        return [
          {
            key: "0",
            title: "Cơ sở y tế",
            description: (
              <div>
                <h5>{healthFacility.rows?.[0].name}</h5>
                <span>
                  <span className="inline-flex items-center">
                    <HiOutlineLocationMarker className="inline-block" />
                  </span>

                  <span> {healthFacility.rows?.[0].address}</span>
                </span>
              </div>
            ),
          },
        ];
      });
    }
  }, [healthFacility]);
  if (!profile?.id) {
    return (
      <div className="h-screen flex items-center justify-center">
        Hãy đăng nhập để đặt lịch!!
      </div>
    );
  }
  return (
    <div className="py-8 flex justify-center bg-blue-100/40 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-12 gap-8 text-base">
          <div className="col-span-12 md:col-span-4">
            <ColorBox title="Thông tin khám" className="min-h-[200px]">
              {current != 4 && (
                <StepBookings
                  current={infoCheckupItems.length - 1}
                  // onChange={onChangeSteps}
                  items={infoCheckupItems}
                />
              )}
              {current == 4 && (
                <div>
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <span className="flex-shrink-0">
                      <CiUser size={18} />
                    </span>
                    <span>{patientProfile?.fullName}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-gray-600">
                    <span className="flex-shrink-0">
                      <FcPhoneAndroid size={18} />
                    </span>
                    <span>{patientProfile?.phone}</span>
                  </div>
                  <div className="text-left mt-2 flex items-start gap-2 text-gray-600">
                    <span className="flex-shrink-0">
                      <CiLocationOn size={18} />
                    </span>
                    <span>{address}</span>
                  </div>
                </div>
              )}
            </ColorBox>
          </div>

          <div className="col-span-12 md:col-span-8" ref={refContent}>
            {/* {current < 3 && ( */}
            <ColorBox
              title={false}
              className={`${current >= 3 ? "w-0 h-0" : ""}`}
            >
              <Tabs
                activeKey={(current + 1).toString()}
                items={tabItems}
                className="h-full"
              />
            </ColorBox>
            {/* )} */}

            {current == 3 && (
              <ComfirmInformation
                previous={stepPrev}
                checkupInfo={doctorChoose}
                next={stepNext}
                schedule={healthExaminationSchedule}
                patientProfile={patientProfile}
                descStatusPatient={descStatusPatient}
              />
            )}

            {current == 4 && (
              <PaymentInformation
                previous={stepPrev}
                checkupInfo={doctorChoose}
                schedule={healthExaminationSchedule}
                patientProfile={patientProfile}
                confirmSuccess={handleConfirmSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
