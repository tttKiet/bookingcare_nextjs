import Image, { StaticImageData } from "next/image";

export interface ProfitUseBookingProps {
  src: StaticImageData;
  title: string;
  description: string;
}

export function ProfitUseBooking({
  src,
  title,
  description,
}: ProfitUseBookingProps) {
  return (
    <div className="flex items-start bg-white rounded-md p-3 shadow-lg border border-gray-100">
      <div className="p-2">
        <Image src={src} width={140} height={140} alt="ANH" />
      </div>
      <div>
        <h3 className="mb-2 text-md font-medium text-blue-950/80">
          {title.toUpperCase()}
        </h3>
        <p className="mb-2 text-sm font-normal text-gray-600/90">
          {description}
        </p>
      </div>
    </div>
  );
}
