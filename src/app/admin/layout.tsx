"use client";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../globals.css";
import { NavAdminPc } from "@/components/navbar";
import { NAV_ADMIN_WIDTH } from "@/contrains";

export const metadata: Metadata = {
  title: "Admin Booking Care",
  description: "Manager for admin!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div>
      <NavAdminPc />
      <div className="m-left-nav-admin">{children}</div>
    </div>
  );
}
