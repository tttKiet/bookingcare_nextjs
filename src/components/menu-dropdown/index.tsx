"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@nextui-org/react";
export interface MenuDropdownProps {
  title: string;
  icon?: React.ReactNode;
  titleType?: string;
  items: any;
  placement?: string;
}

export default function MenuDropdown({ title, items }: MenuDropdownProps) {
  return (
    <Dropdown size="md" placement={"bottom-end"}>
      <DropdownTrigger>
        <Avatar
          isBordered
          size="md"
          color="primary"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        />
      </DropdownTrigger>
      <DropdownMenu variant="flat" className="">
        {items
          .filter(
            (g: any) => g.data.filter((q: any) => q?.show !== false).length > 0
          )
          .map((gr: any) => (
            <DropdownSection
              title={gr.gr}
              key={gr.gr}
              showDivider={gr.gr !== "Hành động"}
            >
              {gr.data
                .filter((d: any) => d?.show !== false)
                .map((d: any) => (
                  <DropdownItem
                    onPress={d?.onClick}
                    className={
                      d.key === "logout" ? "text-danger" : "text-[#000]"
                    }
                    key={d.key}
                    startContent={d?.icon}
                    color={d.key === "logout" ? "danger" : "default"}
                  >
                    {d.label}
                  </DropdownItem>
                ))}
            </DropdownSection>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
}
