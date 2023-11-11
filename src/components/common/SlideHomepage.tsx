import { Carousel } from "antd";
import sli1 from "@/assets/images/slide1.png";
import sli2 from "@/assets/images/slide2.png";
import sli3 from "@/assets/images/slide3.jpg";
import sli4 from "@/assets/images/slide4.png";
import Image from "next/image";
const contentStyle: React.CSSProperties = {
  margin: 0,
  height: 400,
  outline: "none",
  border: "none",
};
export function SlideHomePage() {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className="container mx-auto">
      <div className="relative">
        <div
          className="absolute right-[-20px] top-[-20px] rounded-lg h-full  w-full backdrop-blur-md"
          style={{
            backgroundColor: "rgb(255 255 255 / 0.2)",
          }}
        ></div>
        <Carousel
          autoplay
          dots
          style={{
            boxShadow: "rgba(0, 0, 0, 0.28) -6px 6px 5px -6px",
          }}
          afterChange={onChange}
          className="h-[400px] overflow-hidden rounded-lg"
        >
          <div>
            <Image
              alt="slide"
              src={sli1}
              width={1200}
              height={400}
              className=" object-cover"
              style={contentStyle}
            ></Image>
          </div>
          <div>
            <Image
              alt="slide"
              src={sli2}
              width={1200}
              height={400}
              className=" object-cover"
              style={contentStyle}
            ></Image>
          </div>
          <div>
            <Image
              alt="slide"
              src={sli3}
              height={400}
              width={1200}
              className=" object-cover"
              style={contentStyle}
            ></Image>
          </div>
          <div>
            <Image
              alt="slide"
              src={sli4}
              width={1200}
              height={400}
              className="object-cover"
              style={contentStyle}
            ></Image>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
