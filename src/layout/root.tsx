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
moment.locale("vi");

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminLink = pathname.includes("/admin");
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <StyledComponentsRegistry>
          <SWRConfig
            value={{
              fetcher: (url) =>
                axios
                  .get(url)
                  .then((res) => res.data)
                  .catch((err) => {
                    console.log(err);
                  }),
              shouldRetryOnError: false,
              revalidateOnFocus: false,
            }}
          >
            <ToastMsg containerClassName="text-sm" />
            {!isAdminLink ? (
              <>
                <NavBarTop />
                {children}
              </>
            ) : (
              <>{children}</>
            )}
          </SWRConfig>
        </StyledComponentsRegistry>
      </PersistGate>
    </Provider>
  );
}
