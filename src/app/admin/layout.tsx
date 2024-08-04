"use client";

import { BreadcrumbApp, NotPermission, Profile } from "@/components/common";
import { useAuth } from "@/hooks";
import { Breadcrumb, Layout, Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { LiaClinicMedicalSolid, LiaUserNurseSolid } from "react-icons/lia";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineFeedback, MdSupervisorAccount } from "react-icons/md";
import {
  BsCalendar2Check,
  BsCode,
  BsDpad,
  BsPersonWorkspace,
} from "react-icons/bs";
import { CiBookmarkMinus } from "react-icons/ci";
import { AiOutlineSlack } from "react-icons/ai";
import { BiBulb, BiCalendarStar } from "react-icons/bi";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { PiFlowerTulipThin } from "react-icons/pi";
import { FaBan, FaRankingStar } from "react-icons/fa6";
import { BsBarChart } from "react-icons/bs";
import "../globals.css";
import logo from "../../assets/images/logi_y_te.png";
import { GiPill } from "react-icons/gi";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import IconBgGray from "@/components/common/IconBgGray";
import { GrUserAdd } from "react-icons/gr";
import { IoInformationCircleOutline } from "react-icons/io5";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const classItemMenu = "font-medium text-base";

  const { profile } = useAuth();
  const url = usePathname();
  const breadcrumbArraySplit = url.toString().split("/");

  const items: MenuItem[] = React.useMemo(
    () => [
      {
        key: "/admin",
        label: (
          <Link className={classItemMenu} href="/admin">
            Tổng quan
          </Link>
        ),

        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <LuLayoutDashboard size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/account",
        label: (
          <Link className={classItemMenu} href="/admin/account">
            Tài khoản
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <MdSupervisorAccount size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "health",
        label: <div className={classItemMenu}>Quản lý thông tin y tế</div>,
        children: [
          {
            key: "/admin/health-facility",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/health-facility"
              >
                Cơ sở y tế
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <PiFlowerTulipThin size={20} />
                </IconBgGray>
              );
            },
          },
          {
            key: "/admin/health-facility/room",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/health-facility/clinic-room"
              >
                Phòng khám
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <LiaClinicMedicalSolid size={20} />
                </IconBgGray>
              );
            },
          },
          {
            key: "/admin/type-health-facility",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/type-health-facility"
              >
                Quản lý loại bệnh viện
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <CiBookmarkMinus size={20} />
                </IconBgGray>
              );
            },
          },
          {
            key: "/admin/specialist",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/specialist"
              >
                Chuyên khoa
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <BiBulb size={20} />
                </IconBgGray>
              );
            },
          },
        ],
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <FiPlusCircle size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/examination-services",
        label: (
          <Link className={classItemMenu} href="/admin/examination-services">
            Dịch vụ khám bệnh
          </Link>
        ),
        get icon() {
          console.log("urlurl", url);
          return (
            <IconBgGray active={this.key == url}>
              <BsDpad size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "manager-doctor",
        label: <div className={classItemMenu}>Bác sĩ</div>,
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <LiaUserNurseSolid size={20} />
            </IconBgGray>
          );
        },
        children: [
          {
            key: "/admin/doctor/page",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/doctor/page"
              >
                Chi tiết trang
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <IoInformationCircleOutline size={20} />
                </IconBgGray>
              );
            },
          },
          {
            key: "/admin/academic-degree",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/academic-degree"
              >
                Quản lý học vị
              </Link>
            ),
            get icon() {
              return (
                <IconBgGray active={this.key == url}>
                  <HiOutlineAcademicCap size={20} />
                </IconBgGray>
              );
            },
          },
          {
            key: "/admin/health-axamination-schedule",
            label: (
              <Link
                className={`${classItemMenu} font-normal`}
                href="/admin/health-axamination-schedule"
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
        ],
      },
      {
        key: "/admin/patient",
        label: (
          <Link className={classItemMenu} href="/admin/patient">
            Bệnh nhân
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <GrUserAdd size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/booking",
        label: (
          <Link className={classItemMenu} href="/admin/booking">
            Lịch hẹn
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BsCalendar2Check size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "cedicine",
        label: (
          <Link className={classItemMenu} href="/admin/cedicine">
            Quản Lý thuốc
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <GiPill size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/work",
        label: (
          <Link className={classItemMenu} href="/admin/work">
            Công tác{" "}
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BsPersonWorkspace size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/review",
        label: (
          <Link className={classItemMenu} href="/admin/review">
            Đánh giá
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <MdOutlineFeedback size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/ban",
        label: (
          <Link className={classItemMenu} href="/admin/ban">
            Ban
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <FaBan size={20} />
            </IconBgGray>
          );
        },
      },
      {
        key: "/admin/code",
        label: (
          <Link className={classItemMenu} href="/admin/code">
            Code
          </Link>
        ),
        get icon() {
          return (
            <IconBgGray active={this.key == url}>
              <BsCode size={20} />
            </IconBgGray>
          );
        },
      },
    ],
    [url]
  );
  const [collapsed, setCollapsed] = React.useState(false);

  if (!profile || profile?.Role?.keyType !== "admin") {
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
    position: "fixed",
    left: 0,
    zIndex: 50,
    right: 0,
    backgroundColor: "#fff",
  };

  const contentStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#000",
    backgroundColor: "#f5f5f5",
    marginTop: 70,
    marginLeft: `calc(var(--nav-width-admin) + 20px)`,
  };

  const siderStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#fff",
    height: "100vh",
    position: "fixed",
    top: 90,
    left: 0,
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
          style={siderStyle}
          className="shadow rounded-tr-3xl min-h-screen bg-white overflow-hidden nav-admin-width"
          theme="light"
          trigger={null}
          collapsible
          collapsed={collapsed}
          // width="25%"
          onCollapse={(value) => setCollapsed(value)}
        >
          <h3 className="text-black/70 text-sm text-left font-medium ml-7 my-4 mb-2">
            Menu
          </h3>
          <div className="max-h-[80%]  overflow-auto">
            <Menu
              theme="light"
              className="border-none"
              rootClassName="text-left py-2 border-none"
              defaultOpenKeys={[url]}
              defaultSelectedKeys={[url]}
              mode="inline"
              items={items}
            />
          </div>
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
