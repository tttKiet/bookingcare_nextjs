import Image from "next/image";
import hospitalImg from "../../assets/images/hospital.png";
import hospitaTypelImg from "../../assets/images/hospital-sign.png";
export interface TotalDashBoardHealthFacilitiesAdminProps {}

export function TotalDashBoardHealthFacilitiesAdmin(
  props: TotalDashBoardHealthFacilitiesAdminProps
) {
  return (
    <>
      <div className="gr-admin col-span-4 flex items-center gap-3">
        <div>
          <Image alt="Hospital" src={hospitalImg} width={100} height={100} />
        </div>
        <div className="flex-1 ">
          <h3 className="text-xl font-normal text-pink-600 mb-1">+3000</h3>
          <p className="text-sm font-medium text-gray-600">
            Bệnh viện được đăng kí trên website
          </p>
        </div>
      </div>
      <div className="gr-admin col-span-4 flex items-center gap-3">
        <div>
          <Image
            alt="Hospital Type"
            src={hospitaTypelImg}
            width={100}
            height={100}
          />
        </div>
        <div className="flex-1 ">
          <h3 className="text-xl font-normal text-pink-600 mb-1">+4</h3>
          <p className="text-sm font-medium text-gray-600">Loại bệnh viện</p>
        </div>
      </div>
    </>
  );
}
