"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ModalPositionHere } from "../modal";
import { LoginForm } from "../auth";
import { authApi } from "@/api-services";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks";
import { Avatar, Space } from "antd";

import { AiOutlineUser } from "react-icons/ai";
import MenuDropdown from "@/components/menu-dropdown";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar.-logout";

type Props = {};

const NavBarTop = () => {
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const { login, profile, logout } = useAuth({ revalidateOnMount: true });

  async function handleLogin({ email, password }: any): Promise<boolean> {
    let isOk = false;
    try {
      setLoadingLogin(true);
      const res = await login({ email, password });

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

          <div className="flex items-center gap-2 rounded-lg border justify-center px-10 py-1">
            <div className="py-1 px-2 font-medium text-xs text-blue-800">
              BOOKING CARE
            </div>

            <div className="relative before:absolute before:content-'' before:w-[2px] before:h-[60%] before:left-[calc(-0.25rem-1px)] before:top-[50%] before:translate-y-[-50%] before:bg-black">
              {!profile?.data?.email && (
                <span
                  onClick={toggleShowModal}
                  className="text-blue-600 py-1 px-2 font-medium text-base cursor-pointer hover:text-blue-800 transition-all"
                >
                  LOGIN
                </span>
              )}

              {profile?.data?.email && (
                <div className="flex items-center py-1 px-2">
                  <Space>
                    <Avatar
                      size={30}
                      crossOrigin={"use-credentials"}
                      icon={<AiOutlineUser />}
                      className="flex items-center justify-center text-base bg-transparent rounded-full border-[2px] border-pink-500 text-black"
                    ></Avatar>
                  </Space>
                  <div className=" font-medium text-sm px-3 flex hover:text-blue-800 transition-all">
                    Hi
                    <MenuNavbarLogout />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="rounded-lg border flex justify-center gap-3 py-1 px-3">
            {!profile?.data?.email && (
              <div
                onClick={toggleShowModal}
                className="text-blue-600 border border-spacing-2 py-1 px-3 font-medium text-sm cursor-pointer hover:text-blue-800 transition-all"
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export { NavBarTop };
