"use client";

import ToastMsg from "@/components/ToastMsg";
import { NavBarTop } from "@/components/navbar";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { persistor, store } from "@/redux/store";
import moment from "moment";
import "moment/locale/vi";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import axios from "../axios";
import Link from "next/link";
import Footer from "@/components/footer";
import { ConfigProvider } from "antd";
import theme from "../theme/themeConfig";
import Header from "@/components/navbar/header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
moment.locale("vi");

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLink =
    pathname.includes("/admin") || pathname.includes("/doctor");
  return (
    <StyledComponentsRegistry>
      <ConfigProvider theme={theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <SWRConfig
              value={{
                fetcher: (url) =>
                  axios
                    .get(url)
                    .then((res) => {
                      return res.data;
                    })
                    .catch((err) => {
                      console.log("fetcher error: " + err);
                    }),
                shouldRetryOnError: false,
                revalidateOnFocus: false,
              }}
            >
              <ToastMsg containerClassName="text-sm" />
              <div>
                <ToastContainer
                  position="top-right"
                  autoClose={4000}
                  limit={3}
                  hideProgressBar={false}
                  newestOnTop={false}
                />
              </div>
              {!isAdminLink ? (
                <>
                  <Header />
                  {children}
                  <Footer />
                </>
              ) : (
                <>{children}</>
              )}
            </SWRConfig>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </StyledComponentsRegistry>
  );
}
