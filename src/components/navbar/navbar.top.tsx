"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ModalPositionHere } from "../modal";

type Props = {};

const NavBarTop = () => {
  const [showModalLogin, setShowModalLogin] = useState<boolean>(false);

  function handleLogin(): void {
    console.log("Login");
  }

  function toggleShowModal(): void {
    setShowModalLogin((s) => !s);
  }

  return (
    <div className="bg-white py-4 h-28 flex items-center ">
      <ModalPositionHere
        title="Login"
        body={<p>Login</p>}
        contentBtnCancel="Cancel"
        contentBtnSubmit="Login"
        handleSubmit={handleLogin}
        toggle={toggleShowModal}
        show={showModalLogin}
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

          <div>Middle</div>

          {/* Infor user */}
          <div className="rounded-lg border flex justify-center gap-3 py-3 px-4">
            <div
              onClick={toggleShowModal}
              className="text-blue-600  font-medium text-sm px-3 cursor-pointer hover:text-blue-800 transition-all"
            >
              LOGIN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { NavBarTop };
