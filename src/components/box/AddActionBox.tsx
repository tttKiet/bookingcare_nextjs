import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/react";
import { FiEye } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { LuEdit } from "react-icons/lu";
import { EyeIcon } from "../icons/EyeIcon";
import Link from "next/link";

export interface AddActionBoxProps {
  onClick: () => void;
  title?: string;
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
  content?: string;
}

export function AddActionBox({
  onClick,
  color = "default",
  size = "sm",
  children,
  href,
  title,
  content,
}: AddActionBoxProps) {
  return (
    <Tooltip color="primary" content={content || "thêm"}>
      {href ? (
        <Link
          href={href}
          onClick={onClick}
          className={
            "text-lg text-default-400 cursor-pointer active:opacity-50"
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      ) : (
        <span
          onClick={onClick}
          className="text-lg text-default-400 cursor-pointer active:opacity-50 flex items-center gap-3"
        >
          {title}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </span>
      )}
    </Tooltip>
  );
}
