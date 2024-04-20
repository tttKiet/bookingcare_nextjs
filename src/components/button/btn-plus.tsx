import { Button } from "@nextui-org/button";
import { PlusIcon } from "../icons/PlusIcon";

export interface BtnPlusProps {
  title?: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export function BtnPlus({ title, onClick, disabled }: BtnPlusProps) {
  return (
    <Button
      isDisabled={disabled}
      color="primary"
      // className="text-"
      startContent={
        <PlusIcon
          // width={24} height={24}
          fontSize={20}
        />
      }
      onClick={onClick}
      // size="lg"
    >
      {title || "Thêm"}
    </Button>
  );
}
