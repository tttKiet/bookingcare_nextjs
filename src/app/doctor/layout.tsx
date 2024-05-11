"use client";

import { BreadcrumbApp, NotPermission, Profile } from "@/components/common";
import { useAuth } from "@/hooks";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { BiCalendarStar, BiHomeAlt2 } from "react-icons/bi";
import { BsPlusCircleDotted } from "react-icons/bs";
import { IoBarChartOutline } from "react-icons/io5";
import "../globals.css";
import IconBgGray from "@/components/common/IconBgGray";
import { Image } from "@nextui-org/image";
const { Header, Content, Footer, Sider } = Layout;
import logo from "../../assets/images/logi_y_te.png";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { VscLayoutMenubar } from "react-icons/vsc";
import { TbMessageCircle } from "react-icons/tb";

type MenuItem = Required<MenuProps>["items"][number];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const url = usePathname();

  const classItemMenu = "font-medium text-base";
  const items: {
    key: string;
    label: ReactNode;
    icon: ReactNode;
  }[] = React.useMemo(
    () => [
      {
        key: "/doctor",
        label: (
          <Link className={classItemMenu} href="/doctor">
            Dashboard
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BiHomeAlt2 size={18} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/doctor/working",
        label: (
          <Link className={classItemMenu} href="/doctor/working">
            Công tác
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BiCalendarStar size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/doctor/health-axamination-schedule",
        label: (
          <Link
            className={classItemMenu}
            href="/doctor/health-axamination-schedule"
          >
            Lịch khám bệnh
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BiCalendarStar size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/doctor/check-health",
        label: (
          <Link className={classItemMenu} href="/doctor/check-health">
            Quản lý lịch hẹn
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BsPlusCircleDotted size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/doctor/chat",
        label: (
          <Link className={classItemMenu} href="/doctor/chat">
            Chat
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <TbMessageCircle size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/doctor/chart/revenue",
        label: (
          <Link className={classItemMenu} href="/doctor/chart/revenue">
            Thống kê
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <IoBarChartOutline size={20} />
            </IconBgGray>
          );
        },
      },
    ],
    []
  );
  const [collapsed, setCollapsed] = React.useState(false);

  if (!profile || profile?.Role?.keyType !== "doctor") {
    return <NotPermission />;
  }

  const layoutStyle = {
    borderRadius: 8,
    overflow: "hidden",
    minHeight: "100vh",
  };
  const headerStyle: React.CSSProperties = {
    color: "#000",
    height: 70,
    paddingInline: 28,
    lineHeight: "64px",
    backgroundColor: "#fff",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#000",
    backgroundColor: "#f5f5f5",
  };

  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#000",
  };
  return (
    <Layout style={layoutStyle} className="text-black">
      <Header style={headerStyle} className="shadow flex items-center">
        <div
          style={{
            width: "calc(var(--nav-width-admin) - 28px)",
          }}
          className="text-base flex items-center gap-4 whitespace-nowrap overflow-hidden
           rounded-[6px] text-blue-700 "
        >
          <Image
            width={40}
            height={40}
            src={logo.src}
            alt="LOGO BOOKING CARE"
          />
          <strong> BOOKING CARE</strong>
        </div>
        <div className="flex items-center justify-between flex-1 pl-5">
          <Input
            radius="md"
            variant="bordered"
            color="primary"
            startContent={<SearchIcon width={25} color="gray" />}
            className="w-[330px] text-black"
            size="sm"
            spellCheck={false}
            placeholder="Tìm kiếm..."
          ></Input>
          <Profile />
        </div>
      </Header>
      <Layout className="mt-5 gap-5">
        <Sider
          className="shadow rounded-tr-3xl nav-admin-width font-medium bg-white overflow-hidden"
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          // width="25%"
          style={siderStyle}
          onCollapse={(value) => setCollapsed(value)}
        >
          <h3 className="text-black/70 text-sm text-left font-medium ml-7 my-4 mb-2">
            Menu
          </h3>
          <Menu
            theme="light"
            className="min-h-full"
            rootClassName="text-left py-2"
            defaultOpenKeys={[url]}
            defaultSelectedKeys={[url]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Content style={contentStyle} className="pr-8">
          <div className="mb-5">
            <BreadcrumbApp />
          </div>
          <div className="p[24]">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
