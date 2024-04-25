export interface IIconBgGrayProps {
  children: React.ReactNode;
  marginTopBottom?: number;
  bg?: string;
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function IconBgGray({
  children,
  bg,
  active,
  size = "md",
  marginTopBottom = 10,
}: IIconBgGrayProps) {
  let w = "";
  if (size == "md") {
    w = "w-10 h-10 rounded-2xl ";
  } else if ((size = "sm")) {
    w = "w-8 h-8 rounded-lg";
  }
  const classWrap = `${
    active ? "bg-[#e6f4ff]" : bg || "bg-[rgba(46,55,164,0.08)]"
  } flex items-center justify-center  ${w}`;
  return (
    <div className="mr-3">
      <div className={`${classWrap}`}>{children}</div>
    </div>
  );
}
