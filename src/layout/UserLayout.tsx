"use client";

import { Profile } from "@/components/common";
import { useAuth } from "@/hooks";
import { Image } from "@nextui-org/image";
import { Divider, useDisclosure } from "@nextui-org/react";
import { Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Link from "next/link";
import { ReactNode, useEffect, useMemo, useState } from "react";
import logo from "../assets/images/logi_y_te.png";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";
import { useScroll, useSpring, motion } from "framer-motion";
import { Button } from "@nextui-org/button";

export interface IUserLayout {
  children: React.ReactNode;
}

export default function UserLayout({ children }: IUserLayout) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { profile, login } = useAuth();
  const {
    isOpen: isOpenLogin,
    onOpen: onOpenLogin,
    onClose: onCloseLogin,
  } = useDisclosure({ id: "login" });
  const classItemMenu = "font-medium text-base";
  const url = usePathname();
  const items: {
    key: string;
    label: ReactNode;
    icon?: ReactNode;
  }[] = useMemo(
    () => [
      {
        key: "/",
        label: (
          <Link className={classItemMenu} href="/">
            Trang chủ
          </Link>
        ),
      },
      {
        key: "/health-facility",
        label: (
          <Link className={classItemMenu} href="/health-facility">
            Cơ sở y tế
          </Link>
        ),
      },
      // {
      //   key: "/booking",
      //   label: (
      //     <Link className={classItemMenu} href="/booking">
      //       Đặt lịch
      //     </Link>
      //   ),
      // },
    ],
    []
  );

  const pathname = usePathname();
  const isAdminLink =
    pathname.includes("/admin") ||
    pathname.includes("/doctor") ||
    pathname.includes("/staff") ||
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/test");

  const isDetails =
    pathname.includes("/profile-doctor") ||
    pathname.includes("/health-facility/");
  // bg-[#fafff9]
  const bgClass = isDetails ? "bg-[#fafff9]" : "bg-white";

  const showShadow =
    pathname.includes("/booking") ||
    pathname.includes("/health-facility") ||
    pathname.includes("/user");

  const [isShowShadow, setIsShowShadow] = useState<boolean>(
    !!showShadow || false
  );

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 120 && !showShadow) {
        setIsShowShadow(true);
      } else if (window.scrollY < 120 && !showShadow) {
        setIsShowShadow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.div className="progress-bar" style={{ scaleX }} />
      <Layout className="bg-white">
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            height: 80,
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
          className={`${bgClass}  ${isShowShadow ? "shadow" : ""}`}
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-around ">
              <Link
                href={"/"}
                className="text-base flex items-center gap-4 whitespace-nowrap overflow-hidden
                       rounded-[6px] text-blue-700  cursor-pointer flex-1"
              >
                <Image
                  width={40}
                  height={40}
                  src={logo.src}
                  alt="LOGO BOOKING CARE"
                />
                <strong> BOOKING CARE</strong>
              </Link>
              <div className="flex-1 flex items-center justify-center">
                <Menu
                  theme="light"
                  className={`${bgClass} border-none flex-1`}
                  mode="horizontal"
                  items={items}
                  defaultOpenKeys={[url]}
                  defaultSelectedKeys={[url]}
                />
              </div>

              <div className=" flex-1 flex items-center gap-2 justify-end">
                {!profile?.email ? (
                  <div className="flex items-center gap-4  justify-center py-1">
                    <Link href={"/login"}>
                      <Button
                        onClick={onOpenLogin}
                        color="primary"
                        variant="flat"
                      >
                        Đăng nhập
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Profile />
                )}
              </div>
            </div>
          </div>
        </Header>

        <Content>{children}</Content>
        <Footer></Footer>
      </Layout>
    </>
  );
}
