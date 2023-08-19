import "./globals.css";
import type { Metadata } from "next";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { Inter } from "next/font/google";
import { NavBarTop } from "@/components/navbar";

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
          <NavBarTop />
          {children}
        </body>
      </StyledComponentsRegistry>
    </html>
  );
}
