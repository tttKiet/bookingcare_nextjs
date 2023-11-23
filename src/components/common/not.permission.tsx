import { Button } from "antd";
import Link from "next/link";
import * as React from "react";

export interface NotPermissionProps {}

export function NotPermission(props: NotPermissionProps) {
  return (
    <div className="p-3 min-h-screen flex items-center justify-center">
      <div className="rounded-md h-full  text-red-500">
        Bạn không có quyền truy cập vào trang này.
      </div>
      <Link
        href="/"
        className="p-2 px-4 rounded-sm bg-blue-400 text-white text-base"
      >
        Đăng nhập
      </Link>
    </div>
  );
}
