"use client";
import ToastMsg from "@/components/ToastMsg";
import Footer from "@/components/footer";
import Header from "@/components/navbar/header";
import StyledComponentsRegistry from "@/lib/AntdRegistry";
import { persistor, store } from "@/redux/store";
import { NextUIProvider } from "@nextui-org/react";
import { ConfigProvider } from "antd";
import moment from "moment";
import "moment/locale/vi";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import axios from "../axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import { CustomProvider } from "rsuite";
import theme from "../theme/themeConfig";
import UserLayout from "./UserLayout";
// import { IntlProvider } from "react-intl";
import zhCN from "rsuite/locales/zh_TW";
moment.locale("vi");

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLink =
    pathname.includes("/admin") ||
    pathname.includes("/doctor") ||
    pathname.includes("/staff") ||
    pathname.includes("/login") ||
    pathname.includes("/register") ||
    pathname.includes("/test");

  const excludeLayout = pathname.includes("/result");

  const showUserHeader = !isAdminLink && !excludeLayout;

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
                      return Promise.reject(err);
                    }),
                // shouldRetryOnError: false,
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
              <NextUIProvider>
                <>
                  <CustomProvider>
                    {showUserHeader ? (
                      <UserLayout>
                        {/* <Header /> */}
                        {children}
                        {/* <Footer /> */}
                      </UserLayout>
                    ) : (
                      <>{children}</>
                    )}
                  </CustomProvider>
                </>
              </NextUIProvider>
            </SWRConfig>
          </PersistGate>
        </Provider>
      </ConfigProvider>
    </StyledComponentsRegistry>
  );
}
