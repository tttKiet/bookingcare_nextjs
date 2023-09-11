"use client";

import { userApi } from "@/api-services";
import { useAuth } from "@/hooks";
import { menuNavLink } from "@/list";
import { RegisterFormInterface } from "@/types/auth";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BsBuildingCheck, BsTelephone } from "react-icons/bs";
import { CgDetailsMore } from "react-icons/cg";
import { FaTiktok } from "react-icons/fa";
import { FiFacebook, FiYoutube } from "react-icons/fi";
import { ControlMiddalNavTop } from ".";
import { LoginForm, RegisterForm } from "../auth";
import { Btn } from "../button";
import { Profile } from "../common";
import { ContactItem } from "../contact";
import { ModalPositionHere } from "../modal";
import { NavBarMobile } from "./navbar.mobile.right";
type Props = {};

const NavBarTop = () => {
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);
  const [showNavMobile, setShowNavMobile] = useState<boolean>(false);
  const [showModalRegister, setShowModalRegister] = useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const { login, profile, logout } = useAuth({ revalidateOnMount: true });
  function toggleShowNavMobile() {
    setShowNavMobile((e) => !e);
  }

  // handle login
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
      } else {
        toast.error(res.msg, {
          duration: 2400,
          position: "top-right",
        });
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMsg = err.response.data.msg;
          toast.error(errorMsg);
        } else {
          toast.error("Lỗi không có phản hồi từ server");
        }
      } else {
        const errorWithMsg = err as { msg?: string };
        const errorMsg = errorWithMsg.msg || "Lỗi không xác định";
        toast.error(errorMsg);
      }
      return false;
    } finally {
      setLoadingLogin(false);
    }
    return isOk;
  }

  // Handle register
  async function handleRegister(data: RegisterFormInterface): Promise<boolean> {
    try {
      const res = await userApi.register(data);
      toast.success("Đăng ký thành công");
      toggleShowModalFromForm();
      return true;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const errorMsg = err.response.data.msg;
          toast.error(errorMsg);
        } else {
          toast.error("Lỗi không có phản hồi từ server");
        }
      } else {
        const errorWithMsg = err as { msg?: string };
        const errorMsg = errorWithMsg.msg || "Lỗi không xác định";
        toast.error(errorMsg);
      }
      return false;
    }
  }

  // Toggle show modal login
  function toggleShowModal(): void {
    setShowModalLogin((s) => !s);
  }

  // Toggle show modal register
  function toggleShowModalRegister(): void {
    setShowModalRegister((s) => !s);
  }

  // toggle show modal both login and register. Besides login and register are show single
  function toggleShowModalFromForm() {
    toggleShowModal();
    toggleShowModalRegister();
  }

  return (
    <div className="backdrop-sepia-0 sticky top-0 bg-white z-50  flex justify-center items-center shadow-md   border-b bottom-0">
      <ModalPositionHere
        title="Đăng nhập"
        body={
          <LoginForm
            handleClickRegister={toggleShowModalFromForm}
            loading={loadingLogin}
            handleLogin={handleLogin}
            cancelModal={toggleShowModal}
          />
        }
        handleSubmit={handleLogin}
        toggle={toggleShowModal}
        show={showModalLogin}
        footer={false}
      />

      <ModalPositionHere
        title="Đăng ký"
        body={
          <RegisterForm
            handleClickLogin={toggleShowModalFromForm}
            loading={loadingLogin}
            handleRegister={handleRegister}
            cancelModal={toggleShowModalRegister}
          />
        }
        handleSubmit={handleRegister}
        toggle={toggleShowModalRegister}
        show={showModalRegister}
        footer={false}
        width={760}
      />
      <div className="container text-slate-800 text-base">
        <div className="hidden  md:flex items-center justify-between">
          <div className="flex-1 flex flex-col justify-center">
            {/* top */}
            <div className="flex py-3 justify-between">
              {/* Logo */}
              <div className="flex items-center justify-start">
                <div className="w-2 h-2 bg-blue-600 border-spacing-2 rounded-full"></div>
                <Link href="/" className="ps-2 font-medium">
                  Booking Care
                </Link>
              </div>
              <div className="flex gap-4">
                <ContactItem
                  icon={<BsBuildingCheck size={24} />}
                  title="3/2 CTU"
                  content="CTU university"
                />
                <ContactItem
                  icon={<BsTelephone size={24} />}
                  title="Contact us"
                  content="+84123123233"
                />
              </div>
            </div>
            {/* bottom */}
            <div className="flex border-t items-center py-3">
              {/* Midlle controler */}
              <ControlMiddalNavTop menu={menuNavLink} />
              {/* Infor user */}
              <div className="flex items-center">
                {/* If user dont login */}

                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-blue-500 hover:text-white text-blue-500 transition-all hover:scale-110">
                      <FiFacebook size={16} />
                    </div>
                    <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-black hover:text-white text-black transition-all hover:scale-110">
                      <FaTiktok size={16} />
                    </div>
                    <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-red-500 hover:text-white text-red-500 transition-all hover:scale-110">
                      <FiYoutube className="" size={16} />
                    </div>
                  </div>
                  <span className="px-2">|</span>
                </div>
                {!profile?.email && (
                  <div className="flex items-center gap-2  justify-center py-1">
                    <Btn
                      title="Register"
                      options={{
                        size: "middle",
                        type: "default",
                        shape: "round",
                        onClick: toggleShowModalRegister,
                      }}
                    />
                    <Btn
                      title="Login"
                      options={{
                        size: "middle",
                        type: "primary",
                        shape: "round",
                        onClick: toggleShowModal,
                      }}
                    />
                  </div>
                )}

                {/* If user is logined */}
                <Profile />
              </div>
            </div>
          </div>
        </div>
        <div className="md:hidden flex py-3 justify-between">
          {/* Logo */}
          <div className="flex items-center justify-start">
            <div className="w-2 h-2 bg-blue-600 border-spacing-2 rounded-full"></div>
            <Link href="/" className="ps-2 font-medium">
              Booking Care
            </Link>
            <div className="flex ml-6 items-center gap-2">
              <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-blue-500 hover:text-white text-blue-500 transition-all hover:scale-110">
                <FiFacebook size={16} />
              </div>
              <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-black hover:text-white text-black transition-all hover:scale-110">
                <FaTiktok size={16} />
              </div>
              <div className="border rounded-lg p-2 px-3 cursor-pointer hover:bg-red-500 hover:text-white text-red-500 transition-all hover:scale-110">
                <FiYoutube className="" size={16} />
              </div>
            </div>
          </div>

          {/* more to show nav mobile */}
          <div
            onClick={toggleShowNavMobile}
            className="py-1 px-2 border transition-all rounded-md cursor-pointer text-black hover:text-white hover:bg-blue-500 active:text-white active:bg-blue-500"
          >
            <CgDetailsMore size={22} />
          </div>

          <NavBarMobile
            toggleShowModalRegister={toggleShowModalRegister}
            toggleShowModal={toggleShowModal}
            open={showNavMobile}
            onClose={toggleShowNavMobile}
            menu={menuNavLink}
          />
        </div>
      </div>
    </div>
  );
};

export { NavBarTop };
