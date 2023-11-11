import * as React from "react";

export interface ITitleProps {
  title: string;
  bgTitle: string;
  desc?: string;
}

export default function TitleText({ bgTitle, title, desc }: ITitleProps) {
  return (
    <div
      className="text-center pb-12 "
      style={{
        visibility: "visible",
        animationDelay: "0.2s",
        position: "relative",
        margin: "0 auto",
        paddingTop: "4rem",
      }}
    >
      <div
        className="text-[70px] translate-x-[-50%] whitespace-nowrap"
        style={{
          opacity: 0.2,
          position: "absolute",
          left: "50%",
          top: "0px",
          WebkitBackgroundClip: "content-box",
          WebkitTextFillColor: "rgb(1 43 71 / 14%)",
          fontWeight: 800,
          lineHeight: "1 !important",
          userSelect: "none",
        }}
      >
        {bgTitle}
      </div>
      <div
        className="relative w-full"
        style={{
          fontSize: "50px",
          marginBottom: "1.25rem",
          lineHeight: "60px",
          color: "black",
          fontWeight: "bold",
        }}
      >
        {title}
        <div className="absolute w-2 rounded-lg bg-blue-500 left-0 top-1/2 h-3/4 -translate-y-1/2"></div>
      </div>
      <p className="text-base text-gray-400 my-1">{desc}</p>
    </div>
  );
}
