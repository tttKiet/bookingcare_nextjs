import { ActionGroup, ActionBox } from "../box";
import { Input } from "@nextui-org/react";
import { PatientProfile } from "@/models";
import { useEffect, useState } from "react";
import { useGetAddress } from "@/hooks/use-get-address-from-code";
import moment from "moment";
import { CiUser, CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { FaRegAddressCard, FaSwatchbook } from "react-icons/fa";
import { HiOutlinePhone } from "react-icons/hi";
import { MdOutlineMail } from "react-icons/md";
import { PiGenderIntersex } from "react-icons/pi";
import { SiRotaryinternational } from "react-icons/si";
import Link from "next/link";
import { Button } from "@nextui-org/button";
export interface IBodyPatientProfileProps {
  patientProfile: PatientProfile | undefined;
  onClose: () => void;
  isView?: boolean;
}

export default function BodyPatientProfile({
  patientProfile,
  onClose,
  isView,
}: IBodyPatientProfileProps) {
  const [address, setAddress] = useState<string>("");

  const boxClass = "md:col-span-4 grid-cols-12 ";
  const labelClass = "w-full text-black font-medium";
  const descClass = "text-gray-600";
  const footerClass = "mt-4 flex item-center justify-end";
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
  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <CiUser />
                Tên người khám
              </div>
            }
            className={descClass}
            value={patientProfile?.fullName}
          />
        </div>
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <FaRegAddressCard />
                CCCD
              </div>
            }
            className={`${descClass} font-medium`}
            value={patientProfile?.cccd}
          />
        </div>
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <CiCalendarDate />
                Giới tinh
              </div>
            }
            className={`${descClass}`}
            value={patientProfile?.gender == "male" ? "Nam" : "Nữ"}
          />
        </div>

        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <MdOutlineMail />
                Email
              </div>
            }
            className={`${descClass}`}
            value={patientProfile?.email}
          />
        </div>
        <div className={"md:col-span-6 grid-cols-12 "}>
          {/* <PulseLoader color="gray" size={4} /> */}
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <CiLocationOn />
                Địa chỉ
              </div>
            }
            className={`${descClass}`}
            value={address || "..."}
          />
        </div>
        <div className={"md:col-span-2 grid-cols-12 "}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <PiGenderIntersex />
                Giới tinh
              </div>
            }
            className={`${descClass}`}
            value={moment(patientProfile?.birthDay).format("L")}
          />
        </div>
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <HiOutlinePhone />
                Số điện thoại
              </div>
            }
            className={`${descClass}`}
            value={patientProfile?.phone}
          />
        </div>
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <SiRotaryinternational />
                Tôn giáo
              </div>
            }
            className={`${descClass}`}
            value={patientProfile?.nation}
          />
        </div>
        <div className={boxClass}>
          <Input
            size="lg"
            isReadOnly
            label={
              <div className="flex items-center gap-1">
                <FaSwatchbook />
                Nghề nghiệp
              </div>
            }
            className={`${descClass}`}
            value={patientProfile?.profession}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 justify-end mt-2 py-4">
        {/* <Button
          color="secondary"
          type="button"
          onClick={handleGetInfoFromProfile}
        >
          Lấy thông tin từ hồ sơ
        </Button> */}
        {isView ? (
          <Button color="primary" onPress={onClose}>
            Thoát
          </Button>
        ) : (
          <>
            <Button color="danger" variant="light" onClick={onClose}>
              Thoát
            </Button>
            <Link href={"/staff/patient?profile=" + patientProfile?.id}>
              <Button
                color="primary"
                // isDisabled={}
                type="submit"
              >
                Thêm bệnh nhân từ thông tin này
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
