import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TitleText from "./TitleText";
import useSWR from "swr";
import {
  API_HEALTH_FACILITIES,
  API_SPECIALIST,
} from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { HealthFacility, Specialist } from "@/models";
import Image from "next/image";
import { CiLocationArrow1 } from "react-icons/ci";
export interface IListSpecialistProps {}

export default function ListSpecialist(props: IListSpecialistProps) {
  const { data: healths } = useSWR<ResDataPaginations<HealthFacility>>(
    `${API_HEALTH_FACILITIES}?limit=12`
  );
  console.log("sepecialists", healths);
  return (
    <div>
      <TitleText
        title="Cơ sở y tế"
        bgTitle="Health Facility"
        desc="Hơn 50 bệnh viện lớn ~ 1 triệu phòng khám"
      />
      <div className="text-black">
        <Carousel
          additionalTransfrom={0}
          arrows
          autoPlaySpeed={3000}
          centerMode={false}
          dotListClass=""
          draggable
          focusOnSelect={false}
          infinite
          itemClass=""
          keyBoardControl
          minimumTouchDrag={80}
          pauseOnHover
          renderArrowsWhenDisabled={false}
          renderButtonGroupOutside={false}
          renderDotsOutside={false}
          responsive={{
            desktop: {
              breakpoint: {
                max: 3000,
                min: 1024,
              },
              items: 3,
              partialVisibilityGutter: 40,
            },
            mobile: {
              breakpoint: {
                max: 464,
                min: 0,
              },
              items: 1,
              partialVisibilityGutter: 30,
            },
            tablet: {
              breakpoint: {
                max: 1024,
                min: 464,
              },
              items: 2,
              partialVisibilityGutter: 30,
            },
          }}
          rewind={false}
          rewindWithAnimation={false}
          rtl={false}
          shouldResetAutoplay
          showDots={false}
          sliderClass=""
          slidesToSlide={1}
          swipeable
          className="py-4 px-[-12px]"
        >
          {healths?.rows.map((row: HealthFacility) => (
            <div key={row.id} className="group relative px-1 pr-7 ">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 h-[240px]">
                <Image
                  width={400}
                  height={240}
                  src={row.images?.[0]}
                  alt={row.name}
                  className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700 font-semibold">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {row.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 flex gap-2 items-center">
                    {row.address}
                    <CiLocationArrow1 />
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">{row.phone}</p>
              </div>
            </div>
          ))}
          {healths?.rows.lenth == 0 && <span>Chưa cập nhật db</span>}
        </Carousel>
      </div>
    </div>
  );
}
