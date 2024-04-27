import { SearchIcon } from "@/components/icons/SearchIcon";
import { Input, InputProps } from "@nextui-org/react";

export default function Search(props: InputProps) {
  return (
    <Input
      color="default"
      size="sm"
      className="text-base"
      variant="bordered"
      classNames={{
        input: "px-2 text-base",
        label: "px-2",
      }}
      {...props}
      endContent={
        <div className="flex items-center justify-center h-full cursor-pointer mr-2">
          <SearchIcon />
        </div>
      }
    ></Input>
  );
}
