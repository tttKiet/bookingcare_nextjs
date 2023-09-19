"use client";

import { NotPermission, Profile } from "@/components/common";
import { useAuth } from "@/hooks";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import type { Metadata } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LiaUserNurseSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdSupervisorAccount } from "react-icons/md";
import "../globals.css";
const { Header, Content, Footer, Sider } = Layout;
export const metadata: Metadata = {
  title: "Admin Booking Care",
  description: "Manager for admin!",
};
type MenuItem = Required<MenuProps>["items"][number];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = usePathname();
  const { profile } = useAuth();
  const breadcrumbArraySplit = url.toString().split("/");
  const breadcrumbArray = breadcrumbArraySplit.map((path, index, arrayThis) => {
    return {
      title:
        index + 1 === arrayThis.length ? (
          path
        ) : (
          <Link href={url.slice(0, url.indexOf(path)) + path}>{path}</Link>
        ),
    };
  });
  const items: MenuItem[] = React.useMemo(
    () => [
      {
        key: "/admin",
        label: <Link href="/admin">Tổng quan</Link>,
        icon: <LuLayoutDashboard size={20} />,
      },
      {
        key: "/admin/account",
        label: <Link href="/admin/account">Tài khoản</Link>,
        icon: <MdSupervisorAccount size={20} />,
      },
      {
        key: "health",
        label: "Cơ sở y tế",
        children: [
          {
            key: "/admin/type-health-facility",
            label: (
              <Link href="/admin/type-health-facility">
                Quản lý loại bệnh viện
              </Link>
            ),
            icon: <MdSupervisorAccount size={20} />,
          },
          {
            key: "/admin/health-facility",
            label: (
              <Link href="/admin/health-facility">Quản lý cơ sở y tế</Link>
            ),
            icon: <MdSupervisorAccount size={20} />,
          },
          {
            key: "/admin/specialist",
            label: <Link href="/admin/specialist">Chuyên khoa</Link>,
            icon: <MdSupervisorAccount size={20} />,
          },
        ],
        icon: <FiPlusCircle size={20} />,
      },
      {
        key: "manager-doctor",
        label: "Bác sỉ",
        icon: <LiaUserNurseSolid size={20} />,
        children: [
          {
            key: "/admin/academic-degree",
            label: <Link href="/admin/academic-degree">Quản lý học vị</Link>,
            icon: <MdSupervisorAccount size={20} />,
          },
        ],
      },
    ],
    []
  );
  const [collapsed, setCollapsed] = React.useState(false);

  if (!profile || profile?.Role?.keyType !== "admin") {
    return <NotPermission />;
  }
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={230}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed ? (
          <div className="h-[32px] m-[16px] whitespace-nowrap overflow-hidden rounded-[6px] text-white">
            BOOKING CARE
          </div>
        ) : (
          <div className="h-[32px] m-[16px] bg-[rgba(255,255,255,.2)] rounded-[6px]"></div>
        )}
        <Menu
          theme="dark"
          defaultOpenKeys={[url]}
          defaultSelectedKeys={[url]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header className="flex justify-end items-center text-white px-[16px] bg-dard">
          <Profile />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbArray} />
          <div className="bg-white rounded-lg min-h-[360px] p[24] shadow-md">
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Buikiet Design ©2023 Created by BK
        </Footer>
      </Layout>
    </Layout>
  );
}
