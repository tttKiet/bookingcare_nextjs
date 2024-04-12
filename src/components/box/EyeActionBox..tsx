import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/react";
import { FiEye } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuEdit } from "react-icons/lu";
import { EyeIcon } from "../icons/EyeIcon";
import Link from "next/link";

export interface EyeActionBoxProps {
  onClick: () => void;
  children?: React.ReactNode;
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | undefined;
  size?: "lg" | "md" | "sm" | undefined;
  href?: string;
}

export function EyeActionBox({
  onClick,
  color = "default",
  size = "sm",
  children,
  href,
}: EyeActionBoxProps) {
  return (
    <Tooltip color="secondary" content="xem">
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className={
            "text-lg text-default-400 cursor-pointer active:opacity-50"
          }
        >
          <EyeIcon />
        </Link>
      ) : (
        <span
          onClick={onClick}
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
        >
          <EyeIcon />
        </span>
      )}
    </Tooltip>
  );
}
