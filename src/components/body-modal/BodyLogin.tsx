"use client";

import {
  Tabs,
  Tab,
  Input,
  Link,
  Button,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";
import { useState } from "react";
import { LoginForm, Register } from "../auth";
import { User } from "@/models";
import { toastMsgFromPromise } from "@/untils/get-msg-to-toast";
import { userApi } from "@/api-services";
import { useAuth } from "@/hooks";
import { motion, useAnimate } from "framer-motion";

export interface BodyLoginProps {}

export default function BodyLogin({}: BodyLoginProps) {
  const { profile, login } = useAuth();
  const [scope, animate] = useAnimate();
  const [selected, setSelected] = useState<string>("login");
  const [loading, setLoading] = useState<boolean>(false);
  async function onSubmitLogin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const api = login({ email, password });
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      return true;
    }
    return false;
  }

  async function onSubmitRegister(data: Partial<User>): Promise<boolean> {
    setLoading(true);
    const api = userApi.register(data);
    const res = await toastMsgFromPromise(api);
    if (res.statusCode === 200 || res.statusCode === 0) {
      setSelected("login");
      return true;
    }
    setLoading(false);

    return false;
  }
  const variants = {
    login: { opacity: 1 },
    "sign-up": { opacity: 0, height: "400px" },
  };
  return (
    <div
      ref={scope}
      //   animate={selected ? "login" : "sign-up"}
      //   variants={variants}
    >
      <Tabs
        size="md"
        className="transition-all duration-100 flex justify-end"
        aria-label="Tabs form"
        selectedKey={selected}
        color="secondary"
        onSelectionChange={(e) => {
          setSelected(e?.toString());
        }}
      >
        <Tab key="login" title="Đăng nhập">
          <LoginForm
            handleClickRegister={(key) => {
              setSelected(key);
            }}
            loading={loading}
            handleLogin={onSubmitLogin}
            cancelModal={() => {}}
          />
        </Tab>
        <Tab key="sign-up" title="Đăng ký">
          <Register
            handleClickLogin={(key) => setSelected(key)}
            loading={loading}
            handleRegister={onSubmitRegister}
            cancelModal={() => {}}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
