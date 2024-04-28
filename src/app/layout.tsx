// "use client";

import { RootLayout } from "@/layout";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import "antd/lib";
import "react-markdown-editor-lite/lib/index.css";
const settingFont = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Care",
  description: "Hello veryone. I'm Kiet developer!",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${settingFont.className} `}>
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
