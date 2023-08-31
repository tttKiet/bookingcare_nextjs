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
      <div className="m-left-nav-admin p-3 min-h-full">
        <div className="bg-blue-400/10 h-full p-8 border shadow-md rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
