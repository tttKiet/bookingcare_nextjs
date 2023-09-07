"use client";

import { DropDownProps, Dropdown, MenuProps, Space } from "antd";
import * as React from "react";
import { RiArrowDownSFill } from "react-icons/ri";
import { SmileOutlined } from "@ant-design/icons";
export interface MenuDropdownProps {
  title: string;
  icon?: React.ReactNode;
  options?: DropDownProps;
  titleType?: string;
  items: MenuProps["items"];
}

export default function MenuDropdown({
  title,
  icon,
  options,
  titleType,
  items,
}: MenuDropdownProps) {
  const [showIcon, setShowIcon] = React.useState(false);
  function changeOpenMenu(e: boolean) {
    setShowIcon(e);
  }

  return (
    <Dropdown menu={{ items }} {...options} onOpenChange={changeOpenMenu}>
      <a onClick={(e) => e.preventDefault()}>
        <div className="flex items-center gap-2 relative">
          <span className={titleType}>{title}</span>
          {!showIcon && (
            <span
              className="absolute"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                right: "-18px",
              }}
            >
              {icon ? icon : <RiArrowDownSFill />}
            </span>
          )}
        </div>
      </a>
    </Dropdown>
  );
}
