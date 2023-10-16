import * as React from "react";

export interface ColorBoxProps {
  title: string | false;
  titlePosition?: "center" | "left" | "right";
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function ColorBox({
  title,
  titlePosition = "center",
  children,
  className,
}: ColorBoxProps) {
  return (
    <div
      className={`${className} text-${titlePosition} bg-white text-base rounded-lg overflow-hidden shadow`}
    >
      {title && <h4 className="text-white py-4 px-3 bg-blue-500">{title}</h4>}
      <div className="py-2 px-8">{children}</div>
    </div>
  );
}
