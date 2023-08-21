"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ModalPositionHere } from "../modal";
import { LoginForm } from "../auth";
import { authApi } from "@/api-services";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks";

type Props = {};

const NavBarTop = () => {
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const { login, profile, logout } = useAuth({ revalidateOnMount: false });

  async function handleLogin({ email, password }: any): Promise<boolean> {
    let isOk = false;
    try {
      setLoadingLogin(true);
      const res = await login({ email, password });
      console.log(res);
      console.log("pro", profile);
      if (res.statusCode > 0) {
        toast.error(res.msg, {
          duration: 2400,
          position: "top-right",
        });
      } else if (res.statusCode === 0) {
        setShowModalLogin(false);
        isOk = true;
        toast.success(res.msg, {
          duration: 2400,
          position: "top-right",
        });
      }
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoadingLogin(false);
    }
    return isOk;
  }

  function toggleShowModal(): void {
    setShowModalLogin((s) => !s);
  }

  async function handleLogout(): Promise<void> {
    await logout();
    toast.success("Logged out.");
  }

  return (
    <div className="bg-white py-4 h-28 flex items-center ">
      <ModalPositionHere
        title="Log in"
        body={
          <LoginForm
            loading={loadingLogin}
            handleLogin={handleLogin}
            cancelModal={toggleShowModal}
          />
        }
        contentBtnCancel="Cancel"
        contentBtnSubmit="Login"
        handleSubmit={handleLogin}
        toggle={toggleShowModal}
        show={showModalLogin}
        footer={false}
      />
      <div className="container mx-auto  text-slate-800 text-base">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <div className="w-2 h-2 bg-blue-600 border-spacing-2 rounded-full"></div>
            <Link href="/" className="ps-2 font-medium">
              Booking Care
            </Link>
          </div>

          {/* Midlle controler */}
          <div>Middle nav</div>

          {/* Infor user */}
          <div className="rounded-lg border flex justify-center gap-3 py-3 px-4">
            {!profile?.data?.email && (
              <div
                onClick={toggleShowModal}
                className="text-blue-600  font-medium text-sm px-3 cursor-pointer hover:text-blue-800 transition-all"
              >
                LOGIN
              </div>
            )}
            {profile?.data?.email && (
              <>
                <div
                  onClick={toggleShowModal}
                  className="text-blue-600  font-medium text-sm px-3 cursor-pointer hover:text-blue-800 transition-all"
                >
                  Hello {profile?.data?.email}
                </div>
                <div
                  onClick={handleLogout}
                  className="text-blue-600  font-medium text-sm px-3 cursor-pointer hover:text-blue-800 transition-all"
                >
                  Log out
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { NavBarTop };
