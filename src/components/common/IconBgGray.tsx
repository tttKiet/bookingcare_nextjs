export interface IIconBgGrayProps {
  children: React.ReactNode;
  marginTopBottom?: number;
  bg?: string;
  active?: boolean;
}

export default function IconBgGray({
  children,
  bg,
  active,
  marginTopBottom = 10,
}: IIconBgGrayProps) {
  const classWrap = `${
    active ? "bg-[#e6f4ff]" : bg || "bg-[rgba(46,55,164,0.08)]"
  } flex items-center justify-center rounded-2xl w-10 h-10`;
  return (
    <div className="mr-3">
      <div className={`${classWrap}`}>{children}</div>
    </div>
  );
}
