import * as React from "react";
import Image, { StaticImageData } from "next/image";
export interface INewsProps {
  img: string | StaticImageData;
  title: string;
  time: string;
  href: string;
  desc?: string;
}

export default function News({ img, time, title, desc, href }: INewsProps) {
  return (
    <a
      href={href}
      target="_blank"
      className="h-full block decoration-transparent p-4 bg-white shadow-md rounded-md"
    >
      <Image
        src={img}
        width={448}
        height={280}
        alt="Image"
        className="w-full rounded-md border"
      ></Image>
      <h4 className="text-base my-1 font-semibold">{title}</h4>
      <span className="text-sm text-gray-500">{time}</span>
      {desc && <p className="text-md text-gray-500">{desc}</p>}
    </a>
  );
}
