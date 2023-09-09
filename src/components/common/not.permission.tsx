import { Button } from "antd";
import Link from "next/link";
import * as React from "react";

export interface NotPermissionProps {}

export function NotPermission(props: NotPermissionProps) {
  return (
    <div className="p-3 min-h-screen">
      <div className="p-3 mb-2 rounded-md h-full bg-red-300  shadow-sm text-red-500">
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
