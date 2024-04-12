import { Tooltip } from "@nextui-org/react";
import { IoClose } from "react-icons/io5";
import { LuEdit } from "react-icons/lu";
import { EditIcon } from "../icons/EditIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import Link from "next/link";

export interface ActionBoxProps {
  onClick: () => void;
  type: "delete" | "edit";
  href?: string;
}

export function ActionBox({ onClick, type, href }: ActionBoxProps) {
  const classAction = `p-2 rounded-lg cursor-pointer  ${
    type === "edit"
      ? "text-lg text-default-400 cursor-pointer active:opacity-50"
      : "text-lg text-danger cursor-pointer active:opacity-50"
  }
  `;

  return (
    <Tooltip
      {...(type === "edit"
        ? { content: "sửa" }
        : { color: "danger", content: "xóa" })}
    >
      {href ? (
        <Link href={href} onClick={onClick} className={classAction}>
          {type === "edit" ? <EditIcon /> : <DeleteIcon />}
        </Link>
      ) : (
        <span onClick={onClick} className={classAction}>
          {type === "edit" ? <EditIcon /> : <DeleteIcon />}
        </span>
      )}
    </Tooltip>
  );
}
