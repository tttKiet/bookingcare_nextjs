"use client";

import { NotPermission, Profile } from "@/components/common";
import { useAuth } from "@/hooks";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LiaUserNurseSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdSupervisorAccount } from "react-icons/md";
import { BsCode, BsPersonWorkspace } from "react-icons/bs";
import { CiBookmarkMinus } from "react-icons/ci";
import { AiOutlineSlack } from "react-icons/ai";
import { BiBulb, BiCalendarStar } from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { PiFlowerTulipThin } from "react-icons/pi";
import { FaRankingStar } from "react-icons/fa6";
import { BsBarChart } from "react-icons/bs";
import "../globals.css";
import { GiPill } from "react-icons/gi";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const url = usePathname();
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
            key: "health-facility",
            label: "Nhân viên quản lý",
            icon: <AiOutlineSlack size={20} />,
            children: [
              {
                key: "/admin/health-facility",
                label: <Link href="/admin/health-facility">Cơ sở y tế</Link>,
                icon: <PiFlowerTulipThin size={20} />,
              },
              {
                key: "/admin/health-facility/room",
                label: (
                  <Link href="/admin/health-facility/clinic-room">
                    Phòng khám
                  </Link>
                ),
                icon: <BiBulb size={20} />,
              },
            ],
          },
          {
            key: "/admin/type-health-facility",
            label: (
              <Link href="/admin/type-health-facility">
                Quản lý loại bệnh viện
              </Link>
            ),
            icon: <CiBookmarkMinus size={20} />,
          },
          {
            key: "/admin/specialist",
            label: <Link href="/admin/specialist">Chuyên khoa</Link>,
            icon: <BiBulb size={20} />,
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
            icon: <HiOutlineAcademicCap size={20} />,
          },
          {
            key: "/admin/health-axamination-schedule",
            label: (
              <Link href="/admin/health-axamination-schedule">
                Lịch khám bệnh
              </Link>
            ),
            icon: <BiCalendarStar size={20} />,
          },
        ],
      },

      {
        key: "cedicine",
        label: <Link href="/admin/cedicine">Quản Lý thuốc</Link>,
        icon: <GiPill size={20} />,
      },
      {
        key: "/admin/work",
        label: <Link href="/admin/work">Công tác </Link>,
        icon: <BsPersonWorkspace size={20} />,
      },
      {
        key: "/admin/code",
        label: <Link href="/admin/code">Code</Link>,
        icon: <BsCode size={20} />,
      },
      {
        key: "/admin/chart",
        label: <Link href="/admin/chart">Thống kê</Link>,
        icon: <BsBarChart size={20} />,
      },
      {
        key: "/admin/rank",
        label: <Link href="/admin/rank">Bảng xếp hạng</Link>,
        icon: <FaRankingStar size={20} />,
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
        width={280}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {!collapsed ? (
          <span className="block  h-[32px] m-[16px] whitespace-nowrap overflow-hidden rounded-[6px] text-white">
            BOOKING CARE
          </span>
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
          <div className="bg-white rounded-lg min-h-screen p[24] shadow-md">
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
