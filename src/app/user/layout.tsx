"use client";

import { Layout, MenuProps } from "antd";
import type { Metadata } from "next";
import React from "react";

import "../globals.css";
import { useAuth } from "@/hooks";
const { Header, Content, Footer, Sider } = Layout;
export const metadata: Metadata = {
  title: "Admin Booking Care",
  description: "Manager for admin!",
};

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
