import { Button } from "@nextui-org/button";
import { PlusIcon } from "../icons/PlusIcon";

export interface BtnPlusProps {
  title?: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function BtnPlus({ title, onClick }: BtnPlusProps) {
  return (
    <Button
      color="primary"
      className="text-sm"
      endContent={<PlusIcon width={24} height={24} />}
      onClick={onClick}
      size="sm"
    >
      {title || "Thêm"}
    </Button>
  );
}
