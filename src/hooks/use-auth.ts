import { ResData, authApi } from "@/api-services";
import useSWR from "swr";
import { PublicConfiguration } from "swr/_internal";

export function useAuth(options?: Partial<PublicConfiguration>) {
  const {
    data: profile,
    error,
    mutate,
  } = useSWR("/api/v1/auth/fetch-profile", {
    dedupingInterval: 5000,
    revalidateOnFocus: false,
    ...options,
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
    await mutate();
    return res;
  }

  async function logout(): Promise<ResData> {
    const res = await authApi.logout();
    await mutate({}, false);
    return res;
  }

  return {
    profile,
    error,
    logout,
    login,
  };
}
