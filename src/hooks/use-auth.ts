"use client";

import { authApi } from "@/api-services";
import { ResData } from "@/types";
import { Staff, User, UserProfile } from "@/models";
import { LoginProfile, loginStore, logoutStore } from "../redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { PublicConfiguration, SWRConfiguration } from "swr/_internal";
import { getProfileLoginStore } from "@/redux/selector";
import { useRouter } from "next/navigation";

export function useAuth(options?: Partial<SWRConfiguration>) {
  const distpatch = useDispatch();
  const router = useRouter();
  const profileSlector = useSelector(getProfileLoginStore);
  const {
    data: profile,
    error,
    mutate,
  } = useSWR<LoginProfile>("/api/v1/auth/fetch-profile", {
    dedupingInterval: 5000,
    revalidateOnFocus: false,
    ...options,
    // revalidateOnMount: false,
    fallbackData: profileSlector,
    onSuccess(data, key, config) {
      distpatch(
        loginStore({
          email: data.email,
          fullname: data.fullName,
          Role: data?.Role || null,
          address: data.address,
          gender: data.gender,
          createdAt: data.createdAt,
        })
      );
    },
    onError(error, key, config) {
      distpatch(logoutStore());
    },
  });

  const loading = profile === undefined && error === undefined;

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<ResData> {
    const res = await authApi.login({ email, password });
    if (res?.user?.role?.keyType === "admin") {
      router.push("/admin");
    } else if (res?.user?.role?.keyType === "doctor") {
      router.push("/doctor");
    }

    await mutate();
    return res;
  }

  async function logout(): Promise<ResData> {
    const res = await authApi.logout();
    await mutate(null, false);
    distpatch(logoutStore());

    return res;
  }

  return {
    profile,
    error,
    logout,
    loading,
    login,
  };
}
