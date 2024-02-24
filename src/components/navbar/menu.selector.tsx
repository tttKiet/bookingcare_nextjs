import { Button, Menu, MenuProps } from "antd";
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { FiPlusCircle } from "react-icons/fi";
import { LiaUserNurseSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdSupervisorAccount } from "react-icons/md";
import { useMemo, useState } from "react";
type MenuItem = Required<MenuProps>["items"][number];
export interface MenuSelectorProps {}

export function MenuSelector(props: MenuSelectorProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const menuMain: MenuItem[] = useMemo(
    () => [
      {
        key: "collapsed",
        label: "Tổng quan",
        href: "/admin",
        icon: <LuLayoutDashboard size={20} />,
      },
    ],
    []
  );
  return (
    <div style={{ width: 256 }}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={menuMain}
      />
    </div>
  );
}
