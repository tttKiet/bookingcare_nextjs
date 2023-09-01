"use client";
import ToastMsg from "@/components/ToastMsg";
import { NavBarTop } from "@/components/navbar";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import axios from "../axios";
import "./globals.css";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import moment from "moment";
import "moment/locale/vi";
// import russianLocale from "moment/locale/";
moment.locale("vi");

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
  const pathname = usePathname();
  const isAdminLink = pathname.includes("/admin");
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <body className={inter.className}>
          <SWRConfig
            value={{
              fetcher: (url) => axios.get(url).then((res) => res.data),
              shouldRetryOnError: false,
            }}
          >
            <Provider store={store}>
              <PersistGate persistor={persistor} loading={null}>
                <ToastMsg containerClassName="text-sm" />
                {!isAdminLink ? (
                  <>
                    <NavBarTop />
                    {children}
                  </>
                ) : (
                  <>{children}</>
                )}
              </PersistGate>
            </Provider>
          </SWRConfig>
        </body>
      </StyledComponentsRegistry>
    </html>
  );
}
