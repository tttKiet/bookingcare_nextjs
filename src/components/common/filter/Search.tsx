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
      }}
      {...props}
      endContent={<SearchIcon />}
    ></Input>
  );
}
