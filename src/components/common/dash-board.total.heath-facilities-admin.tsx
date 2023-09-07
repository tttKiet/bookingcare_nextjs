"use client";
import Image from "next/image";
import hospitalImg from "../../assets/images/hospital.png";
import hospitaTypelImg from "../../assets/images/hospital-sign.png";
import useSWR from "swr";
export interface TotalDashBoardHealthFacilitiesAdminProps {}

export interface TotalDashBoardHealthFacilities {
  type: {
    count: number;
    row: any;
  };
  healthFacilities: {
    count: number;
    row: any;
  };
}

export function TotalDashBoardHealthFacilitiesAdmin(
  props: TotalDashBoardHealthFacilitiesAdminProps
) {
  const {
    data: infomation,
    isLoading,
    error,
  } = useSWR<TotalDashBoardHealthFacilities>(
    "/api/v1/admin/health-facilities/infomation/health-facilities-type",
    {
      revalidateOnMount: true,
      dedupingInterval: 60 * 15 * 60, // 15p
    }
  );
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="gr-admin col-span-1 flex items-center gap-3 ">
        <div>
          <Image alt="Hospital" src={hospitalImg} width={100} height={100} />
        </div>
        <div className="flex-1 ">
          <h3 className="text-xl font-normal text-pink-600 mb-1">
            +{infomation?.healthFacilities.count}
          </h3>
          <p className="text-sm font-medium text-gray-600">
            Bệnh viện được đăng kí trên website
          </p>
        </div>
      </div>
      <div className="gr-admin col-span-1 flex items-center gap-3">
        <div>
          <Image
            alt="Hospital Type"
            src={hospitaTypelImg}
            width={100}
            height={100}
          />
        </div>
        <div className="flex-1 ">
          <h3 className="text-xl font-normal text-pink-600 mb-1">
            +{infomation?.type.count}
          </h3>
          <p className="text-sm font-medium text-gray-600">Loại bệnh viện</p>
        </div>
      </div>
    </div>
  );
}
