export interface ColorBoxProps {
  title: string | false;
  titlePosition?: "center" | "left" | "right";
  children: React.ReactNode;
  className?: string;
  color?: string;
}

export function ColorBox({
  title,
  titlePosition = "left",
  children,
  className,
}: ColorBoxProps) {
  return (
    <div
      className={`${className} text-${titlePosition} bg-white text-base  rouded_main overflow-hidden shadow-lg`}
    >
      {title && (
        <h4 className="text-black-main text-lg py-4 px-6 font-medium">
          {title}
        </h4>
      )}
      <div className="py-2 px-8 h-full">{children}</div>
    </div>
  );
}
