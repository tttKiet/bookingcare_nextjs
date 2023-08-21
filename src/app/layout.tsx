"use client";
import "./globals.css";
import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { Inter } from "next/font/google";
import { NavBarTop } from "@/components/navbar";
import ToastMsg from "@/components/ToastMsg";
import { SWRConfig } from "swr";
import axios from "../axios";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booking Care",
  description: "Hello veryone. I'm Kiet developer!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <body className={inter.className}>
          <SWRConfig
            value={{
              fetcher: (url) => axios.get(url),
              shouldRetryOnError: false,
            }}
          >
            <ToastMsg containerClassName="text-sm" />
            <NavBarTop />
            {children}
          </SWRConfig>
        </body>
      </StyledComponentsRegistry>
    </html>
  );
}
