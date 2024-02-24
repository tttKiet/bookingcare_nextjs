import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";

export interface ServiceCardProps {
  src: string;
  title: string;
  description: string;
  linkto: string;
}

export function ServiceCard({
  description,
  linkto,
  src,
  title,
}: ServiceCardProps) {
  return (
    <Link href={linkto} className="rounded-md shadow p-6">
      <div>
        <Image
          width={120}
          height={120}
          className="object-cover w-full rounded-md h-56"
          alt="hospotal"
          src={src}
        ></Image>
      </div>
      <div>
        <h4 className="text-xl font-extralight text-blue-700/80 py-2">
          {title}
        </h4>
        <p className="text-sm text-gray-800">{description}</p>
        <Button type="default" className="mt-3 float-right">
          Chi tiết
        </Button>
      </div>
    </Link>
  );
}
