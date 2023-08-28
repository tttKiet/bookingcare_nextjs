import * as React from "react";

export enum ContactItemSize {
  Small = "sm",
  Large = "lg",
}

export interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  color?: string;
  size?: ContactItemSize;
}

export function ContactItem({
  color,
  content,
  icon,
  size,
  title,
}: ContactItemProps) {
  return (
    <div className="flex gap-2 items-center text-gray-700 ">
      <span className="p-2 rounded-md border">{icon}</span>
      <div className="">
        <h4 className="font-medium text-xs  mb-[2px] text-gray-800">{title}</h4>
        <p className="text-xs font-normal text-gray-600">{content}</p>
      </div>
    </div>
  );
}
