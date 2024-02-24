import { IoClose } from "react-icons/io5";
import { LuEdit } from "react-icons/lu";

export interface ActionBoxProps {
  onClick: () => void;
  type: "delete" | "edit";
}

export function ActionBox({ onClick, type }: ActionBoxProps) {
  const classAction = `p-2 rounded-lg cursor-pointer  ${
    type === "edit"
      ? "text-edit hover:bg-edit-hover"
      : "text-red-800 hover:bg-red-400"
  }
   transition-all duration-150 hover:text-white`;
  return (
    <span onClick={onClick} className={classAction}>
      {type === "edit" ? <LuEdit /> : <IoClose />}
    </span>
  );
}
