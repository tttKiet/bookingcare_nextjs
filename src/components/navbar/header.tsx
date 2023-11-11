"use client";

import { userApi } from "@/api-services";
import { useAuth } from "@/hooks";
import { User } from "@/models";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import hospital from "@/assets/images/hospital.png";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { LoginForm, RegisterForm } from "../auth";
import { ModalPositionHere } from "../modal";
import MenuNavbarLogout from "../menu-dropdown/menu-navbar-logout";
import { Profile } from "../common";
import { ControlMiddalNavTop } from "./nav.middal.top";
import { menuNavLink } from "@/list";
import Image from "next/image";
import { Btn } from "../button";
import { usePathname, useRouter } from "next/navigation";
type Props = {};

const showListToFloat = ["/", "/health-facility"];

export default function Header() {
  const [isAtTop, setIsAtTop] = useState(true);
  const url = usePathname();
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
  async function handleRegister(data: Partial<User>): Promise<boolean> {
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

  // Toggle show modal both login and register. Besides login and register are show single
  function toggleShowModalFromForm() {
    toggleShowModal();
    toggleShowModalRegister();
  }
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop >= 76) {
        setIsAtTop(false);
      } else {
        setIsAtTop(true);
      }
    };

    // Thêm sự kiện lắng nghe cuộn trang
    window.addEventListener("scroll", handleScroll);

    // Cleanup sự kiện khi component bị unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
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
        width={580}
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
      <Disclosure
        as="nav"
        className={` text-white transition-all duration-200 sticky  top-0 left-0 right-0 z-40 ${
          isAtTop && showListToFloat.includes(url)
            ? "bg-transparent"
            : "bg-blue-700 shadow-md"
        }`}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0  flex items-center gap-1 ">
                    <Image
                      height={80}
                      width={80}
                      alt="Booking Care"
                      src={hospital}
                      className="w-8 h-8 text-whit"
                    />
                    <span className="ml-2 whitespace-nowrap text-white font-semibold">
                      Booking Care
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex gap-2 items-baseline space-x-4">
                      <ControlMiddalNavTop menu={menuNavLink} />
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* <button
                      type="button"
                      className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}
                    {/* Profile dropdown */}
                    <Profile></Profile>
                    {!profile?.email && (
                      <div className="flex items-center gap-4  justify-center py-1">
                        <button
                          onClick={toggleShowModalRegister}
                          className="px-6 py-1.5 shadow rounded-md text-sm text-white border-dashed border"
                        >
                          Đăng ký
                        </button>
                        <button
                          onClick={toggleShowModal}
                          className="px-6 py-1.5 rounded-md text-sm text-black"
                          style={{
                            backgroundImage: `linear-gradient(to right, #fff 0%, #fff 51%, #f5f5f5 100%)`,
                            boxShadow: `0 0 1px #eee`,
                            backgroundSize: `200% auto`,
                            border: "1px solid #fff",
                          }}
                        >
                          Đăng nhập
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {/* {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className="bg-gray-900 text-white"
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))} */}
              </div>
              <div className="border-t border-gray-700 pb-3 pt-4">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    {/* <img
                      className="h-10 w-10 rounded-full"
                      src={user.imageUrl}
                      alt=""
                    /> */}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {profile?.fullName}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {profile?.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {/* {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))} */}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );
}
