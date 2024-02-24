import { Button } from "antd";
import { BsPlusSquareDotted } from "react-icons/bs";

export interface BtnPlusProps {
  title?: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export function BtnPlus({ title, onClick, icon }: BtnPlusProps) {
  return (
    <Button
      icon={
        icon ? (
          icon
        ) : (
          <BsPlusSquareDotted
            className="transition-all duration-200"
            // size={20}
          />
        )
      }
      onClick={onClick}
      type="dashed"
      className="flex items-center gap-1 justify-center"
    >
      {title || "Thêm"}
    </Button>
  );
}
