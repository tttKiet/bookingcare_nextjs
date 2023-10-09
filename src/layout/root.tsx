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
moment.locale("vi");

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLink = pathname.includes("/admin");
  return (
    <StyledComponentsRegistry>
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
            {!isAdminLink ? (
              <>
                <NavBarTop />
                <div className="">{children}</div>
                <Footer />
              </>
            ) : (
              <>{children}</>
            )}
          </SWRConfig>
        </PersistGate>
      </Provider>
    </StyledComponentsRegistry>
  );
}
