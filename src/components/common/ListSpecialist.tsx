import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TitleText from "./TitleText";
import useSWR from "swr";
import { API_SPECIALIST } from "@/api-services/constant-api";
import { ResDataPaginations } from "@/types";
import { Specialist } from "@/models";
export interface IListSpecialistProps {}

export default function ListSpecialist(props: IListSpecialistProps) {
  const { data: sepecialists } = useSWR<ResDataPaginations<Specialist>>(
    `${API_SPECIALIST}?limit=12`
  );
  console.log("sepecialists", sepecialists);
  return (
    <div>
      <TitleText
        title="Chuyên khoa"
        bgTitle="Specialist"
        desc="Các chuyên khoa khám bệnh chủ yếu"
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
          {sepecialists?.rows.map((row: Specialist) => (
            <div className="mx-2 ">
              <div className="rounded overflow-hidden bg-white shadow-md">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{row.name}</div>
                  <p
                    className="text-gray-700 text-base h-[170px] text-ellipsis overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: "7",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {row.descriptionDisease}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #bookingCare
                  </span>
                  <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    #specialist
                  </span>
                </div>
              </div>
            </div>
          ))}
          {sepecialists?.rows.lenth == 0 && <span>Chưa cập nhật db</span>}
        </Carousel>
      </div>
    </div>
  );
}
