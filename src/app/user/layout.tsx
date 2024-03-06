"use client";

import { Layout, MenuProps } from "antd";
import React from "react";

import "../globals.css";
import { useAuth } from "@/hooks";
const { Header, Content, Footer, Sider } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  if (!profile?.id)
    return (
      <div className="h-screen flex items-center justify-center">
        Vui lòng đăng nhập để xem chức năng này !!
      </div>
    );
  return <>{children}</>;
}
